package com.example.api.controller;

import com.example.api.dto.TourStatusDTO;
import com.example.api.service.TourStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourstatus")
public class TourStatusController {
    @Autowired
    private TourStatusService tourStatusService;

    @PostMapping
    public ResponseEntity<TourStatusDTO> createTourStatus(@RequestBody TourStatusDTO tourStatusDTO) {
        TourStatusDTO createdTourStatus = tourStatusService.createTourStatus(tourStatusDTO);
        return ResponseEntity.ok(createdTourStatus);
    }
    @GetMapping
    public ResponseEntity<List<TourStatusDTO>> getAllTourStatus() {
        List<TourStatusDTO> tourStatuses = tourStatusService.getAllTourStatus();
        return ResponseEntity.ok(tourStatuses);
    }
    @PutMapping("/{id}")
    public ResponseEntity<TourStatusDTO> updateTourStatus(@PathVariable Integer id, @RequestBody TourStatusDTO tourStatusDTO) {
        TourStatusDTO updatedTourStatus = tourStatusService.updateTourStatus(id, tourStatusDTO);
        return ResponseEntity.ok(updatedTourStatus);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourStatus(@PathVariable Integer id) {
        tourStatusService.deleteTourStatus(id);
        return ResponseEntity.noContent().build();
    }
}
