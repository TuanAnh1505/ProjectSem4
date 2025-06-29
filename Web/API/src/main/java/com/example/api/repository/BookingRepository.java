package com.example.api.repository;

import com.example.api.model.Booking;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
           "AND b.status.statusName = 'Confirmed' " +
           "/* DEBUG: Getting all confirmed bookings for schedule */")
    List<Booking> findConfirmedBookingsForSchedule(@Param("scheduleId") Integer scheduleId);

    @Query("SELECT b FROM Booking b WHERE b.user.userid = :userid")
    List<Booking> findAllByUser_Userid(@Param("userid") Long userid);

    boolean existsByBookingCode(String bookingCode);

    Optional<Booking> findByUser_UseridAndTour_TourIdAndScheduleIdAndStatus_StatusName(Long userId, Integer tourId, Integer scheduleId, String statusName);

    List<Booking> findByStatus_StatusName(String statusName);

    List<Booking> findByScheduleIdAndStatus_StatusName(Integer scheduleId, String statusName);

    @Query("SELECT b FROM Booking b " +
           "JOIN TourSchedule ts ON b.scheduleId = ts.scheduleId " +
           "WHERE b.tour.tourId = :tourId " +
           "AND ts.startDate = :startDate " +
           "AND b.status.statusName = :statusName")
    List<Booking> findByTourTourIdAndScheduleStartDateAndStatusStatusName(
            @Param("tourId") Integer tourId, 
            @Param("startDate") LocalDate startDate, 
            @Param("statusName") String statusName);

    List<Booking> findByStatus_StatusNameAndBookingDateBefore(String statusName, LocalDateTime beforeDate);
}