package com.example.api.repository;

import com.example.api.model.TourItineraryDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface TourItineraryDestinationRepository extends JpaRepository<TourItineraryDestination, Integer> {
    List<TourItineraryDestination> findByItineraryId(Integer itineraryId);
}
