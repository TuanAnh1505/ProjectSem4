package com.example.api.scheduler;

import com.example.api.model.Booking;
import com.example.api.model.TourSchedule;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.TourScheduleRepository;
import com.example.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FeedbackRequestScheduler {
    private final BookingRepository bookingRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 10 0 * * ?") // mỗi ngày lúc 0:10
    public void sendFeedbackRequestEmails() {
        LocalDate today = LocalDate.now();
        List<Booking> bookings = bookingRepository.findAll();
        for (Booking booking : bookings) {
            if (booking.getScheduleId() != null) {
                TourSchedule schedule = tourScheduleRepository.findById(booking.getScheduleId()).orElse(null);
                if (schedule != null && today.isAfter(schedule.getEndDate())) {
                    String feedbackLink = "http://localhost:3000/feedback?bookingId=" + booking.getBookingId();
                    String userName = booking.getUser().getFullName();
                    String tourName = booking.getTour().getName();
                    String endDate = schedule.getEndDate().toString();
                    emailService.sendFeedbackRequestEmail(
                            booking.getUser().getEmail(),
                            userName,
                            tourName,
                            endDate,
                            feedbackLink);
                }
            }
        }
    }
}