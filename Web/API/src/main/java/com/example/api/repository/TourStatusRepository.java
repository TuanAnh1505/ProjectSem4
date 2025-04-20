package com.example.api.repository;

import com.example.api.model.TourStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourStatusRepository extends JpaRepository<TourStatus, Integer> {
}
