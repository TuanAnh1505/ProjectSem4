package com.example.api.repository;

import com.example.api.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer> {
    java.util.Optional<PaymentStatus> findByStatusName(String statusName);
} 