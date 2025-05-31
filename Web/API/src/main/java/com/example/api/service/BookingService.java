package com.example.api.service;

import com.example.api.dto.BookingDTO;
import com.example.api.dto.TourBookingRequest;
import com.example.api.model.*;
import com.example.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final UserRepository userRepository;
    private final TourRepository tourRepository;
    private final DiscountRepository discountRepository;
    private final UserDiscountRepository userDiscountRepository;
    private final BookingRepository bookingRepository;
    private final BookingStatusRepository bookingStatusRepository;
    private final BookingPassengerRepository bookingPassengerRepository;
    private final TourScheduleRepository tourScheduleRepository;

    public Booking createBooking(TourBookingRequest request) {
        try {
            System.out.println("=== Booking Request Received ===");
            System.out.println("User ID: " + request.getUserId());
            System.out.println("Tour ID: " + request.getTourId());
            System.out.println("Schedule ID: " + request.getScheduleId());
            System.out.println("Discount Code: " + request.getDiscountCode());

            // Validate required fields
            if (request.getUserId() == null) {
                throw new RuntimeException("Thiếu thông tin người dùng.");
            }
            if (request.getTourId() == null) {
                throw new RuntimeException("Thiếu thông tin tour.");
            }
            if (request.getScheduleId() == null) {
                throw new RuntimeException("Vui lòng chọn lịch trình cho tour.");
            }

            // Find and validate user
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));

            // Find and validate tour
            Tour tour = tourRepository.findById(request.getTourId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tour với ID: " + request.getTourId()));

            // Find and validate schedule
            Optional<TourSchedule> scheduleOpt = tourScheduleRepository.findById(request.getScheduleId());
            if (!scheduleOpt.isPresent()) {
                throw new RuntimeException("Không tìm thấy lịch trình với ID: " + request.getScheduleId());
            }
            TourSchedule schedule = scheduleOpt.get();
            
            // Validate schedule belongs to tour
            if (!schedule.getTourId().equals(tour.getTourId())) {
                throw new RuntimeException("Lịch trình không thuộc tour này!");
            }

            // Validate schedule status
            if (!"available".equalsIgnoreCase(schedule.getStatus().getValue())) {
                throw new RuntimeException("Lịch trình không ở trạng thái available!");
            }

            // Count current participants for this schedule
            long currentParticipants = bookingRepository.countByScheduleIdAndStatus_StatusName(request.getScheduleId(), "CONFIRMED");
            
            // Check if schedule is full based on tour's maxParticipants
            if (currentParticipants >= tour.getMaxParticipants()) {
                schedule.setStatus(TourSchedule.Status.full);
                tourScheduleRepository.save(schedule);
                throw new RuntimeException("Lịch trình đã đủ số lượng người tham gia!");
            }

            BigDecimal price = tour.getPrice();

            // Handle discount if provided
            Discount discount = null;
            if (request.getDiscountCode() != null && !request.getDiscountCode().isBlank()) {
                discount = discountRepository.findByCode(request.getDiscountCode())
                        .orElseThrow(() -> new RuntimeException("Mã giảm giá không hợp lệ: " + request.getDiscountCode()));

                if (LocalDateTime.now().isBefore(discount.getStartDate()) ||
                        LocalDateTime.now().isAfter(discount.getEndDate())) {
                    throw new RuntimeException("Mã giảm giá đã hết hạn: " + request.getDiscountCode());
                }

                boolean used = userDiscountRepository.existsByUseridAndDiscountIdAndTourIdAndUsedTrue(
                        user.getUserid(), discount.getDiscountId(), tour.getTourId());

                if (used) {
                    throw new RuntimeException("Bạn đã sử dụng mã giảm giá này cho tour này: " + request.getDiscountCode());
                }

                BigDecimal discountAmount = price.multiply(BigDecimal.valueOf(discount.getDiscountPercent()))
                        .divide(BigDecimal.valueOf(100));
                price = price.subtract(discountAmount);
            }

            // Get default status
            BookingStatus status = bookingStatusRepository.findByStatusName("PENDING")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái đặt tour mặc định."));

            // Create and save booking
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setTour(tour);
            booking.setScheduleId(request.getScheduleId());
            booking.setBookingDate(LocalDateTime.now());
            booking.setTotalPrice(price);
            booking.setStatus(status);

            Booking saved = bookingRepository.save(booking);

            // Update schedule status if needed
            long updatedParticipants = bookingRepository.countByScheduleIdAndStatus_StatusName(request.getScheduleId(), "CONFIRMED");
            if (updatedParticipants >= tour.getMaxParticipants()) {
                schedule.setStatus(TourSchedule.Status.full);
                tourScheduleRepository.save(schedule);
            }

            // Save discount usage if applicable
            if (discount != null) {
                UserDiscount ud = new UserDiscount();
                ud.setUserid(user.getUserid());
                ud.setTourId(tour.getTourId());
                ud.setDiscountId(discount.getDiscountId());
                ud.setUsed(true);
                userDiscountRepository.save(ud);
            }

            return saved;
        } catch (Exception e) {
            System.err.println("Lỗi khi đặt tour: " + e.getMessage());
            throw new RuntimeException("Đặt tour thất bại: " + e.getMessage(), e);
        }
    }

    public List<BookingDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllWithUserAndTourAndStatus();
        return bookings.stream().map(b -> new BookingDTO(
                b.getBookingId(),
                b.getUser() != null ? b.getUser().getFullName() : null,
                b.getTour() != null ? b.getTour().getName() : null,
                b.getBookingDate() != null ? b.getBookingDate().toString() : null,
                b.getStatus() != null ? b.getStatus().getStatusName() : null,
                b.getTotalPrice())).collect(Collectors.toList());
    }

    public Map<String, Object> getBookingDetail(Integer bookingId) {
        Booking booking = bookingRepository.findByIdWithUserTourStatus(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(bookingId);

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> bookingDetails = new HashMap<>();
        bookingDetails.put("bookingId", booking.getBookingId());
        bookingDetails.put("bookingDate", booking.getBookingDate());
        bookingDetails.put("totalPrice", booking.getTotalPrice());
        bookingDetails.put("scheduleId", booking.getScheduleId());

        // Get schedule details if scheduleId exists
        if (booking.getScheduleId() != null) {
            TourSchedule schedule = tourScheduleRepository.findById(booking.getScheduleId())
                    .orElse(null);
            if (schedule != null) {
                Map<String, Object> scheduleDetails = new HashMap<>();
                scheduleDetails.put("startDate", schedule.getStartDate());
                scheduleDetails.put("endDate", schedule.getEndDate());
                scheduleDetails.put("status", schedule.getStatus());
                bookingDetails.put("schedule", scheduleDetails);
            }
        }

        // User
        if (booking.getUser() != null) {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("userid", booking.getUser().getUserid());
            userDetails.put("fullName", booking.getUser().getFullName());
            userDetails.put("email", booking.getUser().getEmail());
            userDetails.put("phone", booking.getUser().getPhone());
            userDetails.put("address", booking.getUser().getAddress());
            bookingDetails.put("user", userDetails);
        }

        // Tour
        if (booking.getTour() != null) {
            Map<String, Object> tourDetails = new HashMap<>();
            tourDetails.put("tourId", booking.getTour().getTourId());
            tourDetails.put("name", booking.getTour().getName());
            tourDetails.put("price", booking.getTour().getPrice());
            bookingDetails.put("tour", tourDetails);
        }

        // Status
        if (booking.getStatus() != null) {
            Map<String, Object> statusDetails = new HashMap<>();
            statusDetails.put("statusId", booking.getStatus().getBookingStatusId());
            statusDetails.put("statusName", booking.getStatus().getStatusName());
            bookingDetails.put("status", statusDetails);
        }

        // Passengers
        List<Map<String, Object>> passengerList = passengers.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("passengerId", p.getPassengerId());
            map.put("fullName", p.getFullName());
            map.put("passengerType", p.getPassengerType());
            map.put("gender", p.getGender());
            map.put("birthDate", p.getBirthDate());
            map.put("email", p.getEmail());
            map.put("phone", p.getPhone());
            map.put("address", p.getAddress());
            return map;
        }).collect(Collectors.toList());

        result.put("booking", bookingDetails);
        result.put("passengers", passengerList);
        return result;
    }

    public Booking getBookingById(Integer id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
