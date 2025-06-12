package com.example.api.repository;

import com.example.api.model.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface FeedbackStatusRepository extends JpaRepository<FeedbackStatus, Integer> {
} 