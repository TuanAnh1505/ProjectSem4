package com.example.api.service;

import com.example.api.model.Feedback;
import com.example.api.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(Integer id) {
        return feedbackRepository.findById(id);
    }

    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Integer id) {
        feedbackRepository.deleteById(id);
    }

    public List<Feedback> getFeedbacksByTourId(Integer tourId) {
        return feedbackRepository.findByTour_TourId(tourId);
    }

    public Map<String, Object> getTourFeedbackStats(Integer tourId) {
        Double avg = feedbackRepository.getAverageRatingByTourId(tourId);
        Integer count = feedbackRepository.countByTourId(tourId);
        Map<String, Object> result = new HashMap<>();
        result.put("averageRating", avg != null ? avg : 0.0);
        result.put("feedbackCount", count != null ? count : 0);
        return result;
    }
} 