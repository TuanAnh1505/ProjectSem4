package com.example.api.scheduler.cleanup;

import com.example.api.model.Booking;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class BookingCleanupScheduler {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    // Chạy mỗi 1 tiếng một lần
    @Scheduled(cron = "0 0 * * * ?")
    public void cleanUpPendingBookings() {
        List<Booking> pendingBookings = bookingRepository.findByStatus_StatusName("PENDING");
        int deleted = 0;
        for (Booking booking : pendingBookings) {
            if (paymentRepository.findByBooking_BookingId(booking.getBookingId()).isEmpty()) {
                bookingRepository.delete(booking);
                deleted++;
            }
        }
        if (deleted > 0) {
            System.out.println("[BookingCleanupScheduler] Đã dọn dẹp " + deleted + " booking PENDING không có payment.");
        }
    }
} 