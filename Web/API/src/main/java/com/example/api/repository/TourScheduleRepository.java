package com.example.api.repository;

import com.example.api.model.TourSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourScheduleRepository extends JpaRepository<TourSchedule, Integer> {
    List<TourSchedule> findByTourId(Integer tourId);
    List<TourSchedule> findByStartDate(LocalDate startDate);
}