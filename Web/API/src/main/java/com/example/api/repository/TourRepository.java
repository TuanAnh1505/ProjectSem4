package com.example.api.repository;

import com.example.api.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Integer> {
    @Query("SELECT t FROM Tour t WHERE (:name IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:destinationid IS NULL OR t.destination.destinationid = :destinationid)")
    List<Tour> findByNameAndDestination(@Param("name") String name, @Param("destinationid") Integer destinationid);
}
