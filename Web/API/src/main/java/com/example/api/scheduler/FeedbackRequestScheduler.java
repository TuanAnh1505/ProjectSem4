package com.example.api.scheduler;

import com.example.api.model.Booking;
import com.example.api.model.TourSchedule;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.TourScheduleRepository;
import com.example.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FeedbackRequestScheduler {
    private static final Logger logger = LoggerFactory.getLogger(FeedbackRequestScheduler.class);
    private final BookingRepository bookingRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final EmailService emailService;

    // Chạy ngay khi khởi động và mỗi 5 phút một lần để test
    @Scheduled(initialDelay = 1000, fixedRate = 300000)
    public void sendFeedbackRequestEmails() {
        logger.info("Starting feedback request email scheduler at {}", LocalDate.now());
        LocalDate today = LocalDate.now();
        List<Booking> bookings = bookingRepository.findAll();
        logger.info("Found {} bookings to process", bookings.size());
        
        for (Booking booking : bookings) {
            if (booking.getScheduleId() != null && booking.getUser() != null) {
                TourSchedule schedule = tourScheduleRepository.findById(booking.getScheduleId()).orElse(null);
                if (schedule != null && today.equals(schedule.getEndDate())) {
                    // Kiểm tra xem người dùng có tồn tại và có email không
                    if (booking.getUser().getEmail() == null || booking.getUser().getEmail().isEmpty()) {
                        logger.warn("Cannot send feedback email: User {} has no email address", 
                            booking.getUser().getFullName());
                        continue;
                    }

                    logger.info("Processing feedback request for booking ID: {}, Tour: {}, User: {}", 
                        booking.getBookingId(), 
                        booking.getTour().getName(),
                        booking.getUser().getEmail());
                        
                    String webFeedbackLink = "http://localhost:3000/feedback?bookingId=" + booking.getBookingId();
                    String appFeedbackLink = "myapp://feedback?bookingId=" + booking.getBookingId();
                    String userName = booking.getUser().getFullName();
                    String tourName = booking.getTour().getName();
                    String endDate = schedule.getEndDate().toString();
                    
                    try {
                        emailService.sendFeedbackRequestEmail(
                            booking.getUser().getEmail(),
                            userName,
                            tourName,
                            endDate,
                            webFeedbackLink,
                            appFeedbackLink);
                        logger.info("Successfully sent feedback request email to: {}", booking.getUser().getEmail());
                    } catch (Exception e) {
                        logger.error("Failed to send feedback request email to: {}. Error: {}", 
                            booking.getUser().getEmail(), e.getMessage());
                    }
                }
            }
        }
        logger.info("Completed feedback request email scheduler run");
    }
}