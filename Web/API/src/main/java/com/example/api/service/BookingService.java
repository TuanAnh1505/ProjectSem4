package com.example.api.service;

import com.example.api.dto.BookingDTO;
import com.example.api.dto.BookingDetailDTO;
import com.example.api.dto.BookingPassengerDTO;
import com.example.api.dto.TourBookingRequest;
import com.example.api.dto.TourDTO;
import com.example.api.dto.UserDTO;
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

    public Booking createBooking(TourBookingRequest request) {
        try {
            System.out.println("=== Booking Request Received ===");
            System.out.println("User ID: " + request.getUserId());
            System.out.println("Tour ID: " + request.getTourId());
            System.out.println("Selected Date: " + request.getSelectedDate());
            System.out.println("Discount Code: " + request.getDiscountCode());

            if (request.getUserId() == null || request.getTourId() == null || request.getSelectedDate() == null) {
                throw new RuntimeException("Thiếu thông tin bắt buộc để đặt tour.");
            }

            if (request.getSelectedDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("Ngày khởi hành không hợp lệ (quá khứ).");
            }

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));

            Tour tour = tourRepository.findById(request.getTourId())
                    .orElseThrow(() -> new RuntimeException("Tour không tồn tại."));

            BigDecimal price = tour.getPrice();

            Discount discount = null;
            if (request.getDiscountCode() != null && !request.getDiscountCode().isBlank()) {
                discount = discountRepository.findByCode(request.getDiscountCode())
                        .orElseThrow(() -> new RuntimeException("Mã giảm giá không hợp lệ."));

                if (LocalDateTime.now().isBefore(discount.getStartDate()) ||
                        LocalDateTime.now().isAfter(discount.getEndDate())) {
                    throw new RuntimeException("Mã giảm giá đã hết hạn.");
                }

                boolean used = userDiscountRepository.existsByUseridAndDiscountIdAndTourIdAndUsedTrue(
                        user.getUserid(), discount.getDiscountId(), tour.getTourId());

                if (used) {
                    throw new RuntimeException("Bạn đã sử dụng mã giảm giá này cho tour này.");
                }

                BigDecimal discountAmount = price.multiply(BigDecimal.valueOf(discount.getDiscountPercent()))
                        .divide(BigDecimal.valueOf(100));
                price = price.subtract(discountAmount);
            }

            BookingStatus status = bookingStatusRepository.findByStatusName("PENDING")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái đặt tour mặc định."));

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setTour(tour);
            booking.setBookingDate(LocalDateTime.now());
            booking.setSelectedDate(request.getSelectedDate());
            booking.setTotalPrice(price);
            booking.setStatus(status);

            Booking saved = bookingRepository.save(booking);

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
            e.printStackTrace();
            throw new RuntimeException("Đặt tour thất bại: " + e.getMessage(), e);
        }
    }

    public List<BookingDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllWithUserAndTourAndStatus();
        return bookings.stream().map(b -> new BookingDTO(
                b.getBookingId(),
                b.getUser() != null ? b.getUser().getFullName() : null,
                b.getTour() != null ? b.getTour().getName() : null,
                b.getSelectedDate() != null ? b.getSelectedDate().toString() : null,
                b.getBookingDate() != null ? b.getBookingDate().toString() : null,
                b.getStatus() != null ? b.getStatus().getStatusName() : null,
                b.getTotalPrice())).collect(java.util.stream.Collectors.toList());
    }

    public Map<String, Object> getBookingDetail(Integer bookingId) {
        Booking booking = bookingRepository.findByIdWithUserTourStatus(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(bookingId);

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> bookingDetails = new HashMap<>();
        bookingDetails.put("bookingId", booking.getBookingId());
        bookingDetails.put("bookingDate", booking.getBookingDate());
        bookingDetails.put("selectedDate", booking.getSelectedDate());
        bookingDetails.put("totalPrice", booking.getTotalPrice());

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

        // Passengers: convert to Map, do NOT return entity directly!
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
}