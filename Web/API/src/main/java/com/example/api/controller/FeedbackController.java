package com.example.api.controller;

import com.example.api.dto.FeedbackDTO;
import com.example.api.model.Feedback;
import com.example.api.model.User;
import com.example.api.model.FeedbackStatus;
import com.example.api.model.Booking;
import com.example.api.model.Tour;
import com.example.api.service.FeedbackService;
import com.example.api.service.UserService;
import com.example.api.service.FeedbackStatusService;
import com.example.api.service.BookingService;
import com.example.api.service.TourService;
import com.example.api.repository.BookingRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequiredArgsConstructor
public class FeedbackController {
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    private final FeedbackService feedbackService;
    private final UserService userService;
    private final FeedbackStatusService feedbackStatusService;
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final TourService tourService;

    @GetMapping
    public List<FeedbackDTO> getAllFeedbacks(@RequestParam(value = "tourId", required = false) Integer tourId) {
        List<Feedback> feedbacks = (tourId != null)
            ? feedbackService.getFeedbacksByTourId(tourId)
            : feedbackService.getAllFeedbacks();
        return feedbacks.stream().map(fb -> {
            FeedbackDTO dto = new FeedbackDTO();
            dto.setFeedbackId(fb.getFeedbackId());
            dto.setUserFullName(fb.getUser() != null ? fb.getUser().getFullName() : null);
            dto.setTourId(fb.getTour() != null ? fb.getTour().getTourId() : null);
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
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized attempt to create feedback");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName();
        User user = userService.findByEmail(email);
        if (user == null) {
            logger.warn("User not found for email: {}", email);
            return ResponseEntity.status(404).body("User not found");
        }

        // Kiểm tra xem người dùng có đặt tour này không
        List<Booking> userBookings = bookingRepository.findAllByUser_Userid(user.getUserid());
        boolean hasBookedTour = userBookings.stream()
            .anyMatch(booking -> booking.getTour().getTourId().equals(request.getTourId()));
        
        if (!hasBookedTour) {
            logger.warn("User {} attempted to create feedback for tour {} without booking", 
                email, request.getTourId());
            return ResponseEntity.status(403).body("You can only submit feedback for tours you have booked");
        }

        logger.info("Creating feedback for user: {} and tour: {}", email, request.getTourId());
        
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        Tour tour = tourService.getTourDetail(request.getTourId());
        feedback.setTour(tour);
        feedback.setMessage(request.getMessage());
        feedback.setRating(request.getRating());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());
        FeedbackStatus status = feedbackStatusService.getStatusById(1).orElse(null);
        feedback.setStatus(status);
        Feedback saved = feedbackService.saveFeedback(feedback);
        logger.info("Successfully created feedback with ID: {}", saved.getFeedbackId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Integer id, @RequestBody Feedback feedback) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized attempt to update feedback");
            return ResponseEntity.status(401).body(null);
        }

        Optional<Feedback> existingFeedback = feedbackService.getFeedbackById(id);
        if (existingFeedback.isEmpty()) {
            logger.warn("Feedback not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        // Kiểm tra xem người dùng có quyền cập nhật feedback này không
        if (!existingFeedback.get().getUser().getEmail().equals(authentication.getName())) {
            logger.warn("User {} attempted to update feedback {} without permission", 
                authentication.getName(), id);
            return ResponseEntity.status(403).body(null);
        }

        feedback.setFeedbackId(id);
        feedback.setUser(existingFeedback.get().getUser()); // Giữ nguyên user
        feedback.setUpdatedAt(LocalDateTime.now());
        Feedback updated = feedbackService.saveFeedback(feedback);
        logger.info("Successfully updated feedback with ID: {}", id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized attempt to delete feedback");
            return ResponseEntity.status(401).build();
        }

        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        if (feedback.isEmpty()) {
            logger.warn("Feedback not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        // Kiểm tra xem người dùng có quyền xóa feedback này không
        if (!feedback.get().getUser().getEmail().equals(authentication.getName())) {
            logger.warn("User {} attempted to delete feedback {} without permission", 
                authentication.getName(), id);
            return ResponseEntity.status(403).build();
        }

        feedbackService.deleteFeedback(id);
        logger.info("Successfully deleted feedback with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFeedbackStatus(@PathVariable Integer id, @RequestBody FeedbackStatusUpdateRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized attempt to update feedback status");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        var feedbackOpt = feedbackService.getFeedbackById(id);
        if (feedbackOpt.isEmpty()) {
            logger.warn("Feedback not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        var feedback = feedbackOpt.get();
        var status = feedbackStatusService.getStatusById(req.getStatusId()).orElse(null);
        if (status == null) {
            logger.warn("Invalid status ID: {}", req.getStatusId());
            return ResponseEntity.badRequest().body("Invalid statusId");
        }

        feedback.setStatus(status);
        feedback.setUpdatedAt(java.time.LocalDateTime.now());
        feedbackService.saveFeedback(feedback);
        logger.info("Successfully updated status of feedback {} to {}", id, status.getStatusName());
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