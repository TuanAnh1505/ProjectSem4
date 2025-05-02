package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.EventStatus;

public interface EventStatusRepository extends JpaRepository<EventStatus, Integer> {
    EventStatus findByStatusName(String statusName);
}