package com.example.api.repository;

import com.example.api.model.TourItinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourItineraryRepository extends JpaRepository<TourItinerary, Integer> {

    @Query("SELECT ti FROM TourItinerary ti WHERE ti.scheduleId = :scheduleId ORDER BY ti.itineraryId")
    List<TourItinerary> findByScheduleId(@Param("scheduleId") Integer scheduleId);
}