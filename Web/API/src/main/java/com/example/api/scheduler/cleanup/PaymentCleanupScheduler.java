package com.example.api.scheduler.cleanup;

import com.example.api.model.Payment;
import com.example.api.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class PaymentCleanupScheduler {
    @Autowired
    private PaymentRepository paymentRepository;

    // Chạy mỗi 1 tiếng một lần
    @Scheduled(cron = "0 0 * * * ?")
    public void cleanUpUnpaidPayments() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Payment> expiredPayments = paymentRepository.findByStatus_StatusNameInAndPaymentDateBefore(
            Arrays.asList("PENDING", "PROCESSING"), oneHourAgo
        );
        int deleted = expiredPayments.size();
        paymentRepository.deleteAll(expiredPayments);
        if (deleted > 0) {
            System.out.println("[PaymentCleanupScheduler] Đã dọn dẹp " + deleted + " payment chưa thanh toán quá 1 tiếng.");
        }
    }
} 