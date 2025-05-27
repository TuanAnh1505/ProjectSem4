package com.example.api.repository;

import com.example.api.model.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Integer> {
    List<PaymentHistory> findByPayment_PaymentId(Integer paymentId);
} 