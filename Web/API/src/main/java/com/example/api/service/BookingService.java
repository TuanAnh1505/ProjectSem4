package com.example.api.service;

import com.example.api.dto.BookingDTO;
import com.example.api.dto.TourBookingRequest;
import com.example.api.model.*;
import com.example.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Random;

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
    private final TourGuideAssignmentRepository tourGuideAssignmentRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private DiscountService discountService;

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
                    .orElseThrow(
                            () -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));

            // Check if user is a guide and is already assigned to this schedule
            boolean isGuide = user.getRoles().stream()
                                  .anyMatch(role -> role.getRoleName().equalsIgnoreCase("GUIDE"));

            if (isGuide) {
                boolean isAssigned = tourGuideAssignmentRepository.isGuideAssignedToSchedule(
                        user.getUserid(), request.getScheduleId());
                if (isAssigned) {
                    throw new RuntimeException("Bạn đã được phân công vào lịch trình này và không thể đặt tour.");
                }
            }

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
            long currentParticipants = bookingRepository.countByScheduleIdAndStatus_StatusName(request.getScheduleId(),
                    "CONFIRMED");

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
                        .orElseThrow(
                                () -> new RuntimeException("Mã giảm giá không hợp lệ: " + request.getDiscountCode()));

                if (LocalDateTime.now().isBefore(discount.getStartDate()) ||
                        LocalDateTime.now().isAfter(discount.getEndDate())) {
                    throw new RuntimeException("Mã giảm giá đã hết hạn: " + request.getDiscountCode());
                }

                boolean used = userDiscountRepository.existsByUseridAndDiscountIdAndTourIdAndUsedTrue(
                        user.getUserid(), discount.getDiscountId(), tour.getTourId());

                if (used) {
                    throw new RuntimeException(
                            "Bạn đã sử dụng mã giảm giá này cho tour này: " + request.getDiscountCode());
                }

                // Kiểm tra số lượng mã giảm giá còn lại
                if (!discountService.isDiscountAvailable(discount)) {
                    throw new RuntimeException("Mã giảm giá đã hết số lượng: " + request.getDiscountCode());
                }

                BigDecimal discountAmount = price.multiply(BigDecimal.valueOf(discount.getDiscountPercent()))
                        .divide(BigDecimal.valueOf(100));
                price = price.subtract(discountAmount);
            }

            // Get default status
            BookingStatus status = bookingStatusRepository.findByStatusName("PENDING")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái đặt tour mặc định."));

            // Kiểm tra booking PENDING đã tồn tại cho user/tour/schedule
            Optional<Booking> existingPending = bookingRepository
                    .findByUser_UseridAndTour_TourIdAndScheduleIdAndStatus_StatusName(
                            request.getUserId(), request.getTourId(), request.getScheduleId(), "PENDING");

            Booking booking;
            if (existingPending.isPresent()) {
                Booking pending = existingPending.get();
                // Kiểm tra xem booking này có payment nào chưa
                List<Payment> payments = paymentRepository.findByBooking_BookingId(pending.getBookingId());
                if (payments == null || payments.isEmpty()) {
                    // Nếu chưa có payment nào, xóa booking này để user có thể đặt lại
                    bookingRepository.delete(pending);
                    // Sau đó tạo booking mới như bình thường
                    booking = new Booking();
                    booking.setUser(user);
                    booking.setTour(tour);
                    booking.setScheduleId(request.getScheduleId());
                    booking.setBookingDate(LocalDateTime.now());
                    booking.setTotalPrice(price);
                    booking.setStatus(status);
                    if (discount != null) {
                        booking.setDiscountCode(discount.getCode());
                        booking.setDiscountId(discount.getDiscountId());
                        // Cập nhật số lượng mã giảm giá đã dùng
                        if (!discountService.checkAndUpdateDiscountQuantity(discount)) {
                            throw new RuntimeException("Mã giảm giá đã hết số lượng!");
                        }
                    }
                    String bookingCode;
                    do {
                        bookingCode = generateBookingCode();
                    } while (bookingRepository.existsByBookingCode(bookingCode));
                    booking.setBookingCode(bookingCode);
                } else {
                    // Nếu đã có payment, cập nhật lại booking như logic hiện tại
                    booking = pending;
                    booking.setBookingDate(LocalDateTime.now());
                    booking.setTotalPrice(price);
                    booking.setStatus(status);
                    booking.setDiscountCode(discount != null ? discount.getCode() : null);
                    booking.setDiscountId(discount != null ? discount.getDiscountId() : null);
                }
            } else {
                // Tạo booking mới như hiện tại
                booking = new Booking();
                booking.setUser(user);
                booking.setTour(tour);
                booking.setScheduleId(request.getScheduleId());
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(price);
                booking.setStatus(status);
                if (discount != null) {
                    booking.setDiscountCode(discount.getCode());
                    booking.setDiscountId(discount.getDiscountId());
                    // Cập nhật số lượng mã giảm giá đã dùng
                    if (!discountService.checkAndUpdateDiscountQuantity(discount)) {
                        throw new RuntimeException("Mã giảm giá đã hết số lượng!");
                    }
                }
                String bookingCode;
                do {
                    bookingCode = generateBookingCode();
                } while (bookingRepository.existsByBookingCode(bookingCode));
                booking.setBookingCode(bookingCode);
            }
            Booking saved = bookingRepository.save(booking);

            // Update schedule status if needed
            long updatedParticipants = bookingRepository.countByScheduleIdAndStatus_StatusName(request.getScheduleId(),
                    "CONFIRMED");
            if (updatedParticipants >= tour.getMaxParticipants()) {
                schedule.setStatus(TourSchedule.Status.full);
                tourScheduleRepository.save(schedule);
            }

            // Xóa phần lưu UserDiscount ở đây vì sẽ chuyển sang PaymentService
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
                b.getBookingCode(),
                b.getUser() != null ? b.getUser().getFullName() : null,
                b.getTour() != null ? b.getTour().getName() : null,
                b.getBookingDate() != null ? b.getBookingDate().toString() : null,
                b.getStatus() != null ? b.getStatus().getStatusName() : null,
                b.getTotalPrice(),
                b.getScheduleId())).collect(Collectors.toList());
                
    }

    public Map<String, Object> getBookingDetail(Integer bookingId) {
        Booking booking = bookingRepository.findByIdWithUserTourStatus(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(bookingId);

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> bookingDetails = new HashMap<>();
        bookingDetails.put("bookingId", booking.getBookingId());
        bookingDetails.put("bookingCode", booking.getBookingCode());
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
            List<String> imageUrls = booking.getTour().getImageUrls();
            tourDetails.put("imageUrl", (imageUrls != null && !imageUrls.isEmpty()) ? imageUrls.get(0) : null);
            tourDetails.put("description", booking.getTour().getDescription());
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

    public List<Map<String, Object>> getBookingsByUserPublicId(String publicId) {
        var user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Booking> bookings = bookingRepository.findAllByUser_Userid(user.getUserid());
        // Sắp xếp theo bookingDate giảm dần
        bookings.sort((a, b) -> b.getBookingDate().compareTo(a.getBookingDate()));
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("bookingId", b.getBookingId());
            map.put("bookingCode", b.getBookingCode());
            map.put("tourName", b.getTour() != null ? b.getTour().getName() : null);
            // Lấy lịch trình (nếu có)
            String scheduleInfo = null;
            if (b.getScheduleId() != null) {
                var scheduleOpt = tourScheduleRepository.findById(b.getScheduleId());
                if (scheduleOpt.isPresent()) {
                    var sch = scheduleOpt.get();
                    scheduleInfo = sch.getStartDate() + " - " + sch.getEndDate();
                }
            }
            map.put("scheduleInfo", scheduleInfo);
            // Số người: đếm số BookingPassenger của booking này
            int passengerCount = bookingPassengerRepository.findByBooking_BookingId(b.getBookingId()).size();
            map.put("passengerCount", passengerCount);
            map.put("totalPrice", b.getTotalPrice());
            map.put("status", b.getStatus() != null ? b.getStatus().getStatusName() : null);
            // Lấy trạng thái payment
            var payments = paymentRepository.findByBooking_BookingId(b.getBookingId());
            String paymentStatus = payments != null && !payments.isEmpty() && payments.get(0).getStatus() != null
                    ? payments.get(0).getStatus().getStatusName()
                    : "PENDING";
            map.put("paymentStatus", paymentStatus);
            result.add(map);
        }
        return result;
    }

    // Generate booking code: BKyyyyMMddHHmmssSSS + 3 random digits
    private String generateBookingCode() {
        String letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String numbers = "0123456789";
        StringBuilder code = new StringBuilder("BK");
        Random random = new Random();

        // Generate 18 random mixed characters
        for (int i = 0; i < 18; i++) {
            // Randomly decide whether to add a letter or number
            if (random.nextBoolean()) {
                code.append(letters.charAt(random.nextInt(letters.length())));
            } else {
                code.append(numbers.charAt(random.nextInt(numbers.length())));
            }
        }

        return code.toString();
    }
}
