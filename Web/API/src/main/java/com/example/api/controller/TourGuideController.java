package com.example.api.controller;

import com.example.api.dto.CreateGuideRequestDTO;
import com.example.api.dto.TourGuideDTO;
import com.example.api.service.TourGuideService;
import com.example.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tour-guides")
@CrossOrigin(origins = "http://localhost:3000")
public class TourGuideController {

    @Autowired
    private TourGuideService tourGuideService;

    @Autowired
    private UserService userService;

    // Create new tour guide - only admin can create
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
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

    // Update tour guide - only admin can update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourGuideDTO> updateTourGuide(
            @PathVariable Long id,
            @Valid @RequestBody TourGuideDTO tourGuideDTO) {
        TourGuideDTO updatedTourGuide = tourGuideService.updateTourGuide(id, tourGuideDTO);
        return ResponseEntity.ok(updatedTourGuide);
    }

    // Delete tour guide - only admin can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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

    // Thêm endpoint tìm kiếm tour guide theo trạng thái (isAvailable)
    @GetMapping("/search/available")
    public ResponseEntity<List<TourGuideDTO>> findByIsAvailable(@RequestParam Boolean isAvailable) {
        List<TourGuideDTO> tourGuides = tourGuideService.findByIsAvailable(isAvailable);
        return ResponseEntity.ok(tourGuides);
    }

    // Thêm endpoint tìm kiếm tổng hợp (ví dụ: tìm tour guide có rating >= minRating, experience >= minExperience, specialization, language, isAvailable)
    @GetMapping("/search")
    public ResponseEntity<List<TourGuideDTO>> searchTourGuides(
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Boolean isAvailable) {
        List<TourGuideDTO> tourGuides = tourGuideService.searchTourGuides(minRating, minExperience, specialization, language, isAvailable);
        return ResponseEntity.ok(tourGuides);
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createGuideAccount(@RequestBody CreateGuideRequestDTO dto) {
        // 1. Tạo user mới với role GUIDE, gửi mail thông tin tài khoản
        var user = userService.createGuideUserAndSendMail(
            dto.getFullName(),
            dto.getEmail(),
            dto.getPassword(),
            dto.getPhone(),
            dto.getAddress()
        );
        // 2. Tạo bản ghi tour_guides
        var guide = tourGuideService.createTourGuideForUser(
            user.getUserid(),
            dto.getExperienceYears(),
            dto.getSpecialization(),
            dto.getLanguages()
        );
        return ResponseEntity.ok(guide);
    }
}
