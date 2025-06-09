package com.example.api.controller;

import com.example.api.dto.FeedbackDTO;
import com.example.api.model.Feedback;
import com.example.api.model.User;
import com.example.api.model.FeedbackStatus;
import com.example.api.service.FeedbackService;
import com.example.api.service.UserService;
import com.example.api.service.FeedbackStatusService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private UserService userService;
    @Autowired
    private FeedbackStatusService feedbackStatusService;

    @GetMapping
    public List<FeedbackDTO> getAllFeedbacks(@RequestParam(value = "tourId", required = false) Integer tourId) {
        List<Feedback> feedbacks = (tourId != null)
            ? feedbackService.getFeedbacksByTourId(tourId)
            : feedbackService.getAllFeedbacks();
        return feedbacks.stream().map(fb -> {
            FeedbackDTO dto = new FeedbackDTO();
            dto.setFeedbackId(fb.getFeedbackId());
            dto.setUserFullName(fb.getUser() != null ? fb.getUser().getFullName() : null);
            dto.setTourId(fb.getTourId());
            dto.setRating(fb.getRating());
            dto.setMessage(fb.getMessage());
            dto.setStatusName(fb.getStatus() != null ? fb.getStatus().getStatusName() : null);
            dto.setCreatedAt(fb.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Integer id) {
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setTourId(request.getTourId());
        feedback.setMessage(request.getMessage());
        feedback.setRating(request.getRating());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());
        FeedbackStatus status = feedbackStatusService.getStatusById(1).orElse(null);
        feedback.setStatus(status);
        Feedback saved = feedbackService.saveFeedback(feedback);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Integer id, @RequestBody Feedback feedback) {
        if (!feedbackService.getFeedbackById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        feedback.setFeedbackId(id);
        return ResponseEntity.ok(feedbackService.saveFeedback(feedback));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Integer id) {
        if (!feedbackService.getFeedbackById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFeedbackStatus(@PathVariable Integer id, @RequestBody FeedbackStatusUpdateRequest req) {
        var feedbackOpt = feedbackService.getFeedbackById(id);
        if (feedbackOpt.isEmpty()) return ResponseEntity.notFound().build();
        var feedback = feedbackOpt.get();
        var status = feedbackStatusService.getStatusById(req.getStatusId()).orElse(null);
        if (status == null) return ResponseEntity.badRequest().body("Invalid statusId");
        feedback.setStatus(status);
        feedback.setUpdatedAt(java.time.LocalDateTime.now());
        feedbackService.saveFeedback(feedback);
        return ResponseEntity.ok("OK");
    }

    @Data
    public static class FeedbackRequest {
        private Integer tourId;
        private String message;
        private Integer rating;
    }

    @Data
    public static class FeedbackStatusUpdateRequest {
        private Integer statusId;
    }
} 