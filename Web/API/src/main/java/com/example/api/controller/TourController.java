package com.example.api.controller;

import com.example.api.dto.DestinationDTO;
import com.example.api.dto.TourDTO;
import com.example.api.model.Tour;
import com.example.api.service.TourService;
import com.example.api.service.FeedbackService;
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
import java.util.ArrayList;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TourController {

    @Autowired
    private final TourService tourService;

    @Autowired
    private final FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours(
            @RequestParam(required = false) Integer destinationId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        boolean hasFilter = destinationId != null || month != null || year != null || minPrice != null || maxPrice != null;
        if (hasFilter) {
            return ResponseEntity.ok(tourService.getFilteredTours(destinationId, month, year, minPrice, maxPrice));
        }
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(tourService.getTourDetail(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Tour> createTour(@ModelAttribute TourDTO dto, @RequestParam("files") List<MultipartFile> files) {
        List<String> imageUrls = new ArrayList<>();
        try {
            if (files != null && !files.isEmpty()) {
                Path uploadPath = Paths.get("uploads", "tours");
                Files.createDirectories(uploadPath);
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        imageUrls.add("/uploads/tours/" + fileName);
                    }
                }
            }
            dto.setImageUrls(imageUrls);
            return ResponseEntity.ok(tourService.createTour(dto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
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
            Path uploadPath = Paths.get("uploads", "tours"); 
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/tours/" + fileName; 
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
    public ResponseEntity<List<DestinationDTO>> getTourDestinations(@PathVariable Integer tourId) {
        try {
            return ResponseEntity.ok(tourService.getTourDestinations(tourId));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
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

    @GetMapping("/{tourId}/feedback-stats")
    public ResponseEntity<?> getTourFeedbackStats(@PathVariable Integer tourId) {
        return ResponseEntity.ok(feedbackService.getTourFeedbackStats(tourId));
    }

    @GetMapping("/{tourId}/images")
    public ResponseEntity<List<String>> getTourImages(@PathVariable Integer tourId) {
        try {
            Tour tour = tourService.getTourDetail(tourId);
            return ResponseEntity.ok(tour.getImageUrls() != null ? tour.getImageUrls() : new ArrayList<>());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Tour> getTourByName(@PathVariable String name) {
        return ResponseEntity.ok(tourService.getTourByName(name));
    }

}
