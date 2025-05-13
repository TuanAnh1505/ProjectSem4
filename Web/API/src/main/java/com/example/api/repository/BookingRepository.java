package com.example.api.repository;

import com.example.api.model.Booking;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    @Query("SELECT b FROM Booking b " +
        "LEFT JOIN FETCH b.user " +
        "LEFT JOIN FETCH b.tour " +
        "LEFT JOIN FETCH b.status")
    List<Booking> findAllWithUserAndTourAndStatus();

    @Query("SELECT b FROM Booking b " +
        "LEFT JOIN FETCH b.user " +
        "LEFT JOIN FETCH b.tour " +
        "LEFT JOIN FETCH b.status " +
        "WHERE b.bookingId = :id")
    Optional<Booking> findByIdWithUserTourStatus(@Param("id") Integer id);

}