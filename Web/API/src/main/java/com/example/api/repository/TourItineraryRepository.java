package com.example.api.repository;

import com.example.api.model.TourItinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourItineraryRepository extends JpaRepository<TourItinerary, Integer> {
    List<TourItinerary> findByTourId(Integer tourId);
}
