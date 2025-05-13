package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.BookingPassenger;

import java.util.List;

public interface BookingPassengerRepository extends JpaRepository<BookingPassenger, Integer> {
    List<BookingPassenger> findByBooking_BookingId(Integer bookingId);
}
