package com.example.api.repository;

import com.example.api.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByTour_TourId(Integer tourId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.tour.tourId = :tourId")
    Double getAverageRatingByTourId(@Param("tourId") Integer tourId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.tour.tourId = :tourId")
    Integer countByTourId(@Param("tourId") Integer tourId);
} 