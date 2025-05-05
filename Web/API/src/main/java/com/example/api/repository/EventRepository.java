package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.Event;

public interface EventRepository extends JpaRepository<Event, Integer> {
}