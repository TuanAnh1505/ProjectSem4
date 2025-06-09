package com.example.api.service;

import com.example.api.model.FeedbackStatus;
import com.example.api.repository.FeedbackStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackStatusService {
    @Autowired
    private FeedbackStatusRepository feedbackStatusRepository;

    public List<FeedbackStatus> getAllStatuses() {
        return feedbackStatusRepository.findAll();
    }

    public Optional<FeedbackStatus> getStatusById(Integer id) {
        return feedbackStatusRepository.findById(id);
    }

    public FeedbackStatus saveStatus(FeedbackStatus status) {
        return feedbackStatusRepository.save(status);
    }

    public void deleteStatus(Integer id) {
        feedbackStatusRepository.deleteById(id);
    }
} 