package com.example.api.repository;

import com.example.api.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Integer>, JpaSpecificationExecutor<Tour> {
    @Query(value = "SELECT * FROM tour ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Tour> findRandomTours(@Param("count") int count);

    @Query(value = "SELECT * FROM tour WHERE id != :excludeTourId ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Tour> findRandomToursWithExclusion(@Param("count") int count, @Param("excludeTourId") Integer excludeTourId);

    @Query("SELECT t FROM Tour t WHERE LOWER(t.name) = LOWER(:name)")
    Tour findByName(@Param("name") String name);
}