package com.example.api.service;

import com.example.api.dto.TourBookingRequest;
import com.example.api.model.*;
import com.example.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final UserRepository userRepository;
        private final TourRepository tourRepository;
        private final DiscountRepository discountRepository;
        private final UserDiscountRepository userDiscountRepository;
        private final BookingRepository bookingRepository;
        private final BookingStatusRepository bookingStatusRepository;
    
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
                            user.getUserid(), discount.getDiscountId(), tour.getTourId()
                    );
    
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
    }