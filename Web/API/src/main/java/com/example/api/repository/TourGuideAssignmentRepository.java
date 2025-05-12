package com.example.api.repository;

import com.example.api.model.TourGuideAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourGuideAssignmentRepository extends JpaRepository<TourGuideAssignment, TourGuideAssignment.TourGuideAssignmentId> {
    List<TourGuideAssignment> findByTourId(Integer tourId);
    List<TourGuideAssignment> findByGuideId(Integer guideId);
    boolean existsByTourIdAndGuideId(Integer tourId, Integer guideId);
    @Query("SELECT tga FROM TourGuideAssignment tga WHERE tga.tour.id = :tourId AND tga.guide.rating >= :minRating")
    List<TourGuideAssignment> findByTourIdAndGuideMinRating(
            @Param("tourId") Integer tourId,
            @Param("minRating") Double minRating);
    @Query("SELECT tga FROM TourGuideAssignment tga WHERE tga.guide.id = :guideId AND tga.tour.status.statusName = :statusName")
    List<TourGuideAssignment> findByGuideIdAndTourStatus(
            @Param("guideId") Integer guideId,
            @Param("statusName") String statusName);
    void deleteByTourIdAndGuideId(Integer tourId, Integer guideId);
} 