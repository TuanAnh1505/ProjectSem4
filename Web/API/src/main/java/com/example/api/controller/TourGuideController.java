package com.example.api.controller;

import com.example.api.dto.TourGuideDTO;
import com.example.api.service.TourGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tour-guides")
public class TourGuideController {

    @Autowired
    private TourGuideService tourGuideService;

    @PostMapping
    public ResponseEntity<TourGuideDTO> createTourGuide(@Valid @RequestBody TourGuideDTO tourGuideDTO) {
        TourGuideDTO createdTourGuide = tourGuideService.createTourGuide(tourGuideDTO);
        return ResponseEntity.ok(createdTourGuide);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourGuideDTO> getTourGuideById(@PathVariable Integer id) {
        TourGuideDTO tourGuide = tourGuideService.getTourGuideById(id);
        return ResponseEntity.ok(tourGuide);
    }

    @GetMapping
    public ResponseEntity<List<TourGuideDTO>> getAllTourGuides() {
        List<TourGuideDTO> tourGuides = tourGuideService.getAllTourGuides();
        return ResponseEntity.ok(tourGuides);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourGuideDTO> updateTourGuide(@PathVariable Integer id, @Valid @RequestBody TourGuideDTO tourGuideDTO) {
        TourGuideDTO updatedTourGuide = tourGuideService.updateTourGuide(id, tourGuideDTO);
        return ResponseEntity.ok(updatedTourGuide);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourGuide(@PathVariable Integer id) {
        tourGuideService.deleteTourGuide(id);
        return ResponseEntity.noContent().build();
    }
}
