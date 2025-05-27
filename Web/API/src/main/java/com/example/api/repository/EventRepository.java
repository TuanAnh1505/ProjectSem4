package com.example.api.repository;

import com.example.api.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    @Query("SELECT e FROM Event e JOIN e.tours t WHERE t.tourId = :tourId")
    List<Event> findByTourId(Integer tourId);
}