package com.example.api.controller;

import com.example.api.dto.TourDTO;
import com.example.api.model.Tour;
import com.example.api.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TourController {

    @Autowired
    private final TourService tourService;

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(tourService.getTourDetail(id));
    }

    @PostMapping
    public ResponseEntity<Tour> createTour(@RequestBody TourDTO dto) {
        return ResponseEntity.ok(tourService.createTour(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Integer id, @RequestBody TourDTO dto) {
        return ResponseEntity.ok(tourService.updateTour(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Integer id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file");
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads", "tours"); // Changed to include tours subdirectory
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/tours/" + fileName; // Updated URL path
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<Tour>> getRandomTours(
            @RequestParam(defaultValue = "3") int count,
            @RequestParam Integer excludeTourId) {
        return ResponseEntity.ok(tourService.getRandomTours(count, excludeTourId));
    }

    @GetMapping("/{tourId}/destinations")
    public ResponseEntity<?> getTourDestinations(@PathVariable Integer tourId) {
        try {
            return ResponseEntity.ok(tourService.getTourDestinations(tourId));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid tour ID format");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching destinations");
        }
    }

    @GetMapping("/{tourId}/events")
    public ResponseEntity<?> getTourEvents(@PathVariable Integer tourId) {
        try {
            return ResponseEntity.ok(tourService.getTourEvents(tourId));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid tour ID format");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching events");
        }
    }

}
