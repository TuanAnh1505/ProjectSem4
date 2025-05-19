package com.example.api.repository;

import com.example.api.model.TourSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourScheduleRepository extends JpaRepository<TourSchedule, Integer> {
    List<TourSchedule> findByTourId(Integer tourId);
}