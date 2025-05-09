package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.TourStatus;

public interface TourStatusRepository extends JpaRepository<TourStatus, Integer> {
}