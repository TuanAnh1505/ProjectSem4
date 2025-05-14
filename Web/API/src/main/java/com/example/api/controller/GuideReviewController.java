package com.example.api.controller;

import com.example.api.dto.GuideReviewDTO;
import com.example.api.service.GuideReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/guide-reviews")
@CrossOrigin(origins = "*")
public class GuideReviewController {

    @Autowired
    private GuideReviewService guideReviewService;

    @PostMapping
    public ResponseEntity<GuideReviewDTO> createReview(@Valid @RequestBody GuideReviewDTO reviewDTO) {
        try {
            GuideReviewDTO createdReview = guideReviewService.createReview(reviewDTO);
            return ResponseEntity.ok(createdReview);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<GuideReviewDTO>> getAllReviews() {
        List<GuideReviewDTO> reviews = guideReviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<GuideReviewDTO>> getReviewsByGuideId(@PathVariable Integer guideId) {
        List<GuideReviewDTO> reviews = guideReviewService.getReviewsByGuideId(guideId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GuideReviewDTO>> getReviewsByUserId(@PathVariable Long userId) {
        List<GuideReviewDTO> reviews = guideReviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/guide/{guideId}/rating")
    public ResponseEntity<List<GuideReviewDTO>> getReviewsByGuideIdAndMinRating(
            @PathVariable Integer guideId,
            @RequestParam Integer minRating) {
        List<GuideReviewDTO> reviews = guideReviewService.getReviewsByGuideIdAndMinRating(guideId, minRating);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer reviewId) {
        try {
            guideReviewService.deleteReview(reviewId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 