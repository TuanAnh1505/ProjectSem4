package com.example.api.repository;

import com.example.api.model.TourGuideAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourGuideAssignmentRepository extends JpaRepository<TourGuideAssignment, Integer> {
    List<TourGuideAssignment> findByTourId(Integer tourId);
    List<TourGuideAssignment> findByGuideId(Integer guideId);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM TourGuideAssignment a " +
           "WHERE a.guideId = :guideId " +
           "AND a.status != 'cancelled' " +
           "AND ((a.startDate <= :endDate AND a.endDate >= :startDate) " +
           "OR (a.startDate >= :startDate AND a.startDate <= :endDate) " +
           "OR (a.endDate >= :startDate AND a.endDate <= :endDate))")
    boolean existsOverlappingAssignment(
            @Param("guideId") Integer guideId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM TourGuideAssignment a WHERE a.tour.id = :tourId AND a.guide.rating >= :minRating")
    List<TourGuideAssignment> findByTourIdAndGuideMinRating(
            @Param("tourId") Integer tourId,
            @Param("minRating") Double minRating);

    @Query("SELECT a FROM TourGuideAssignment a JOIN TourStatus ts ON a.tour.statusId = ts.tourStatusId " +
           "WHERE a.guide.id = :guideId AND ts.statusName = :statusName")
    List<TourGuideAssignment> findByGuideIdAndTourStatus(
            @Param("guideId") Integer guideId,
            @Param("statusName") String statusName);

    Optional<TourGuideAssignment> findByTourIdAndGuideIdAndStartDate(
            @Param("tourId") Integer tourId,
            @Param("guideId") Integer guideId,
            @Param("startDate") LocalDate startDate);

    boolean existsByGuideIdAndTourSchedule_ScheduleId(Integer guideId, Integer scheduleId);

    @Query("SELECT COUNT(a) > 0 FROM TourGuideAssignment a WHERE a.guide.user.userid = :userId AND a.tourSchedule.scheduleId = :scheduleId")
    boolean isGuideAssignedToSchedule(@Param("userId") Long userId, @Param("scheduleId") Integer scheduleId);

    List<TourGuideAssignment> findByTourSchedule_TourId(Integer tourId);

    List<TourGuideAssignment> findByGuide_User_Userid(Long userId);
} 