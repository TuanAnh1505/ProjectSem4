package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}




