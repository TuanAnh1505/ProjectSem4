package com.example.api.repository;

import com.example.api.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Integer> {
    @Query("SELECT d FROM Destination d JOIN d.tours t WHERE t.tourId = :tourId")
    List<Destination> findByTourId(Integer tourId);
}