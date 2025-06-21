package com.example.api.controller;

import com.example.api.dto.TourGuideAssignmentDTO;
import com.example.api.service.TourGuideAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tour-guide-assignments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TourGuideAssignmentController {

    @Autowired
    private TourGuideAssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<?> createAssignment(
            @RequestBody @Valid TourGuideAssignmentDTO dto) {
        try {
            TourGuideAssignmentDTO assignment = assignmentService.createAssignment(dto);
            return ResponseEntity.ok(assignment);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<TourGuideAssignmentDTO>> getAllAssignments() {
        List<TourGuideAssignmentDTO> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<TourGuideAssignmentDTO>> getAssignmentsByTourId(
            @PathVariable Integer tourId) {
        List<TourGuideAssignmentDTO> assignments = assignmentService.getAssignmentsByTourId(tourId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<TourGuideAssignmentDTO>> getAssignmentsByGuideId(
            @PathVariable Integer guideId) {
        List<TourGuideAssignmentDTO> assignments = assignmentService.getAssignmentsByGuideId(guideId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/tour/{tourId}/rating")
    public ResponseEntity<List<TourGuideAssignmentDTO>> getAssignmentsByTourIdAndGuideMinRating(
            @PathVariable Integer tourId,
            @RequestParam Double minRating) {
        List<TourGuideAssignmentDTO> assignments = assignmentService.getAssignmentsByTourIdAndGuideMinRating(tourId, minRating);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/guide/{guideId}/status")
    public ResponseEntity<List<TourGuideAssignmentDTO>> getAssignmentsByGuideIdAndTourStatus(
            @PathVariable Integer guideId,
            @RequestParam String statusName) {
        List<TourGuideAssignmentDTO> assignments = assignmentService.getAssignmentsByGuideIdAndTourStatus(guideId, statusName);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/my-assignments")
    public ResponseEntity<List<TourGuideAssignmentDTO>> getCurrentGuideAssignments() {
        try {
            List<TourGuideAssignmentDTO> assignments = assignmentService.getCurrentGuideAssignments();
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{assignmentId}/status")
    public ResponseEntity<?> updateAssignmentStatus(
            @PathVariable Integer assignmentId,
            @RequestParam String newStatus) {
        try {
            TourGuideAssignmentDTO updatedAssignment = assignmentService.updateAssignmentStatusByMainGuide(assignmentId, newStatus);
            return ResponseEntity.ok(updatedAssignment);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable Integer assignmentId) {
        try {
            assignmentService.deleteAssignment(assignmentId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 