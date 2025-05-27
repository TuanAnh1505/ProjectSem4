package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api.model.TourItinerary;
import java.util.List;

@Repository
public interface TourItineraryRepository extends JpaRepository<TourItinerary, Integer> {
    List<TourItinerary> findByScheduleId(Integer scheduleId);
}