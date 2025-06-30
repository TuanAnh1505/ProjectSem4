package com.example.api.controller;

import com.example.api.dto.ScheduleChangeRequestDTO;
import com.example.api.service.ScheduleChangeRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/schedule-change-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ScheduleChangeRequestController {
    private static final Logger logger = LoggerFactory.getLogger(ScheduleChangeRequestController.class);
    
    private final ScheduleChangeRequestService scheduleChangeRequestService;

    @PostMapping
    public ResponseEntity<ScheduleChangeRequestDTO> createRequest(@RequestBody ScheduleChangeRequestDTO dto) {
        logger.info("Creating schedule change request for schedule: {}", dto.getScheduleId());
        try {
            ScheduleChangeRequestDTO createdRequest = scheduleChangeRequestService.createRequest(dto);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            logger.error("Error creating schedule change request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<ScheduleChangeRequestDTO>> getRequestsByGuide(@PathVariable Integer guideId) {
        logger.info("Fetching schedule change requests for guide: {}", guideId);
        try {
            List<ScheduleChangeRequestDTO> requests = scheduleChangeRequestService.getRequestsByGuide(guideId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching requests for guide {}: {}", guideId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ScheduleChangeRequestDTO>> getPendingRequests() {
        logger.info("Fetching all pending schedule change requests");
        try {
            List<ScheduleChangeRequestDTO> requests = scheduleChangeRequestService.getPendingRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching pending requests: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ScheduleChangeRequestDTO>> getAllRequests() {
        logger.info("Fetching all schedule change requests");
        try {
            List<ScheduleChangeRequestDTO> requests = scheduleChangeRequestService.getAllRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching all requests: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<ScheduleChangeRequestDTO> approveRequest(
            @PathVariable Integer requestId,
            @RequestParam String adminResponse,
            @RequestParam Long adminId) {
        logger.info("Approving schedule change request: {}", requestId);
        try {
            ScheduleChangeRequestDTO approvedRequest = scheduleChangeRequestService.approveRequest(requestId, adminResponse, adminId);
            return ResponseEntity.ok(approvedRequest);
        } catch (Exception e) {
            logger.error("Error approving request {}: {}", requestId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<ScheduleChangeRequestDTO> rejectRequest(
            @PathVariable Integer requestId,
            @RequestParam String adminResponse,
            @RequestParam Long adminId) {
        logger.info("Rejecting schedule change request: {}", requestId);
        try {
            ScheduleChangeRequestDTO rejectedRequest = scheduleChangeRequestService.rejectRequest(requestId, adminResponse, adminId);
            return ResponseEntity.ok(rejectedRequest);
        } catch (Exception e) {
            logger.error("Error rejecting request {}: {}", requestId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
} 