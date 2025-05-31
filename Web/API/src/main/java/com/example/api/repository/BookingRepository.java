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

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.scheduleId = :scheduleId AND b.status.statusName = :statusName")
    long countByScheduleIdAndStatus_StatusName(@Param("scheduleId") Integer scheduleId, @Param("statusName") String statusName);

    @Query("SELECT COUNT(DISTINCT bp.passengerId) FROM BookingPassenger bp " +
           "JOIN bp.booking b " +
           "WHERE b.scheduleId = :scheduleId " +
           "AND b.status.statusName = 'CONFIRMED' " +
           "/* DEBUG: Counting distinct confirmed passengers for schedule. " +
           "This query counts unique passengers in confirmed bookings */")
    long countConfirmedPassengersForSchedule(@Param("scheduleId") Integer scheduleId);

    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.scheduleId = :scheduleId " +
           "AND b.status.statusName = 'CONFIRMED' " +
           "AND NOT EXISTS (" +
           "    SELECT 1 FROM BookingPassenger bp " +
           "    WHERE bp.booking.bookingId = b.bookingId " +
           "    AND bp.user.userid = b.user.userid" +
           ") " +
           "/* DEBUG: Counting bookings where booker is not a passenger. " +
           "This query counts confirmed bookings where the booker is not listed as a passenger */")
    long countBookingsWithoutBookerAsPassenger(@Param("scheduleId") Integer scheduleId);

    @Query("SELECT b.scheduleId FROM Booking b WHERE b.bookingId = :bookingId " +
           "/* DEBUG: Finding schedule ID for booking */")
    Integer findScheduleIdByBookingId(@Param("bookingId") Integer bookingId);

    @Query("SELECT b FROM Booking b " +
           "WHERE b.scheduleId = :scheduleId " +
           "AND b.status.statusName = 'CONFIRMED' " +
           "/* DEBUG: Getting all confirmed bookings for schedule */")
    List<Booking> findConfirmedBookingsForSchedule(@Param("scheduleId") Integer scheduleId);
}