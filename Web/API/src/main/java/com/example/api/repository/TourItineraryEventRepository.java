package com.example.api.repository;


import com.example.api.model.TourItineraryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourItineraryEventRepository extends JpaRepository<TourItineraryEvent, Integer> {
    List<TourItineraryEvent> findByItineraryId(Integer itineraryId);
}