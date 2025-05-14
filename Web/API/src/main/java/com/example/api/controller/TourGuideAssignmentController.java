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
@CrossOrigin(origins = "*")
public class TourGuideAssignmentController {

    @Autowired
    private TourGuideAssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<TourGuideAssignmentDTO> createAssignment(
            @RequestParam @Valid Integer tourId,
            @RequestParam @Valid Integer guideId) {
        try {
            TourGuideAssignmentDTO assignment = assignmentService.createAssignment(tourId, guideId);
            return ResponseEntity.ok(assignment);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
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

    @DeleteMapping("/{tourId}/{guideId}")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable Integer tourId,
            @PathVariable Integer guideId) {
        try {
            assignmentService.deleteAssignment(tourId, guideId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 