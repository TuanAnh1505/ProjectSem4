package com.example.api.repository;

import com.example.api.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Integer> {
    @Query(value = "SELECT * FROM tours WHERE tour_id <> :excludeTourId ORDER BY RAND() LIMIT 4", nativeQuery = true)
    List<Tour> findRandomTours(@Param("excludeTourId") Integer excludeTourId);


}