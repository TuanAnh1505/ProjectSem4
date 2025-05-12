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
@CrossOrigin(origins = "*")
public class TourGuideController {

    @Autowired
    private TourGuideService tourGuideService;

    // Create new tour guide
    @PostMapping
    public ResponseEntity<TourGuideDTO> createTourGuide(@Valid @RequestBody TourGuideDTO tourGuideDTO) {
        TourGuideDTO createdTourGuide = tourGuideService.createTourGuide(tourGuideDTO);
        return ResponseEntity.ok(createdTourGuide);
    }

    // Get tour guide by ID
    @GetMapping("/{id}")
    public ResponseEntity<TourGuideDTO> getTourGuideById(@PathVariable Long id) {
        TourGuideDTO tourGuide = tourGuideService.getTourGuideById(id);
        return ResponseEntity.ok(tourGuide);
    }

    // Get all tour guides
    @GetMapping
    public ResponseEntity<List<TourGuideDTO>> getAllTourGuides() {
        List<TourGuideDTO> tourGuides = tourGuideService.getAllTourGuides();
        return ResponseEntity.ok(tourGuides);
    }

    // Update tour guide
    @PutMapping("/{id}")
    public ResponseEntity<TourGuideDTO> updateTourGuide(
            @PathVariable Long id,
            @Valid @RequestBody TourGuideDTO tourGuideDTO) {
        TourGuideDTO updatedTourGuide = tourGuideService.updateTourGuide(id, tourGuideDTO);
        return ResponseEntity.ok(updatedTourGuide);
    }

    // Delete tour guide
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTourGuide(@PathVariable Long id) {
        tourGuideService.deleteTourGuide(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/rating")
    public ResponseEntity<List<TourGuideDTO>> findByMinRating(
            @RequestParam Double minRating) {
        List<TourGuideDTO> tourGuides = tourGuideService.findByMinRating(minRating);
        return ResponseEntity.ok(tourGuides);
    }

    @GetMapping("/search/experience")
    public ResponseEntity<List<TourGuideDTO>> findByMinExperience(
            @RequestParam Integer minExperience) {
        List<TourGuideDTO> tourGuides = tourGuideService.findByMinExperience(minExperience);
        return ResponseEntity.ok(tourGuides);
    }

    @GetMapping("/search/specialization")
    public ResponseEntity<List<TourGuideDTO>> findBySpecialization(
            @RequestParam String specialization) {
        List<TourGuideDTO> tourGuides = tourGuideService.findBySpecialization(specialization);
        return ResponseEntity.ok(tourGuides);
    }

    @GetMapping("/search/language")
    public ResponseEntity<List<TourGuideDTO>> findByLanguage(
            @RequestParam String language) {
        List<TourGuideDTO> tourGuides = tourGuideService.findByLanguage(language);
        return ResponseEntity.ok(tourGuides);
    }
}
