package com.example.api.controller;

import com.example.api.dto.TourStatusDTO;
import com.example.api.service.TourStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tour-status")
public class TourStatusController {

    @Autowired
    private TourStatusService tourStatusService;

    @PostMapping
    public ResponseEntity<TourStatusDTO> createTourStatus(@Valid @RequestBody TourStatusDTO tourStatusDTO) {
        TourStatusDTO createdTourStatus = tourStatusService.createTourStatus(tourStatusDTO);
        return ResponseEntity.ok(createdTourStatus);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourStatusDTO> getTourStatusById(@PathVariable Integer id) {
        TourStatusDTO tourStatus = tourStatusService.getTourStatusById(id);
        return ResponseEntity.ok(tourStatus);
    }

    @GetMapping
    public ResponseEntity<List<TourStatusDTO>> getAllTourStatuses() {
        List<TourStatusDTO> tourStatuses = tourStatusService.getAllTourStatuses();
        return ResponseEntity.ok(tourStatuses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourStatusDTO> updateTourStatus(@PathVariable Integer id, @Valid @RequestBody TourStatusDTO tourStatusDTO) {
        TourStatusDTO updatedTourStatus = tourStatusService.updateTourStatus(id, tourStatusDTO);
        return ResponseEntity.ok(updatedTourStatus);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourStatus(@PathVariable Integer id) {
        tourStatusService.deleteTourStatus(id);
        return ResponseEntity.noContent().build();
    }
}
