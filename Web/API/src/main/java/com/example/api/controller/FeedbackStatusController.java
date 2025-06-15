package com.example.api.controller;

import com.example.api.model.FeedbackStatus;
import com.example.api.service.FeedbackStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback-status")
public class FeedbackStatusController {
    @Autowired
    private FeedbackStatusService feedbackStatusService;

    @GetMapping
    public List<FeedbackStatus> getAllStatuses() {
        return feedbackStatusService.getAllStatuses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackStatus> getStatusById(@PathVariable Integer id) {
        Optional<FeedbackStatus> status = feedbackStatusService.getStatusById(id);
        return status.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public FeedbackStatus createStatus(@RequestBody FeedbackStatus status) {
        return feedbackStatusService.saveStatus(status);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackStatus> updateStatus(@PathVariable Integer id, @RequestBody FeedbackStatus status) {
        if (!feedbackStatusService.getStatusById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        status.setStatusId(id);
        return ResponseEntity.ok(feedbackStatusService.saveStatus(status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Integer id) {
        if (!feedbackStatusService.getStatusById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        feedbackStatusService.deleteStatus(id);
        return ResponseEntity.noContent().build();
    }
} 