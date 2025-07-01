package com.example.api.repository;

import com.example.api.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByBooking_BookingId(Integer bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByStatus_StatusNameInAndPaymentDateBefore(List<String> statusNames, LocalDateTime beforeTime);
    Optional<Payment> findByPaymentCode(String paymentCode);
}




