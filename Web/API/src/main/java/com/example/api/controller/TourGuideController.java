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
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tour-guides")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TourGuideController {

    @Autowired
    private TourGuideService tourGuideService;

    @Autowired
    private UserService userService;

    // Create new tour guide - only admin can create
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTourGuide(@Valid @RequestBody TourGuideDTO tourGuideDTO) {
        try {
            TourGuideDTO createdTourGuide = tourGuideService.createTourGuide(tourGuideDTO);
            return ResponseEntity.ok(createdTourGuide);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get tour guide by ID
    @GetMapping("/{id}")
    public ResponseEntity<TourGuideDTO> getTourGuideById(@PathVariable Long id) {
        TourGuideDTO tourGuide = tourGuideService.getTourGuideById(id);
        return ResponseEntity.ok(tourGuide);
    }

    // Get all tour guides
    @GetMapping
    public ResponseEntity<?> getAllTourGuides(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "id,asc") String sort) {
        try {
            List<TourGuideDTO> tourGuides = tourGuideService.getAllTourGuides();
            
            // Filter by search term if provided
            if (search != null && !search.trim().isEmpty()) {
                tourGuides = tourGuides.stream()
                    .filter(guide -> 
                        (guide.getUserFullName() != null && guide.getUserFullName().toLowerCase().contains(search.toLowerCase())) ||
                        (guide.getUserEmail() != null && guide.getUserEmail().toLowerCase().contains(search.toLowerCase())) ||
                        (guide.getSpecialization() != null && guide.getSpecialization().toLowerCase().contains(search.toLowerCase())) ||
                        (guide.getLanguages() != null && guide.getLanguages().toLowerCase().contains(search.toLowerCase()))
                    )
                    .collect(Collectors.toList());
            }
            
            // Sort if provided
            if (sort != null && !sort.trim().isEmpty()) {
                String[] sortParts = sort.split(",");
                String sortField = sortParts[0];
                String sortDirection = sortParts.length > 1 ? sortParts[1] : "asc";
                
                tourGuides.sort((a, b) -> {
                    int comparison = 0;
                    switch (sortField.toLowerCase()) {
                        case "id":
                            comparison = a.getGuideId().compareTo(b.getGuideId());
                            break;
                        case "userfullname":
                            comparison = (a.getUserFullName() != null ? a.getUserFullName() : "").compareTo(b.getUserFullName() != null ? b.getUserFullName() : "");
                            break;
                        case "useremail":
                            comparison = (a.getUserEmail() != null ? a.getUserEmail() : "").compareTo(b.getUserEmail() != null ? b.getUserEmail() : "");
                            break;
                        case "experienceyears":
                            comparison = Integer.compare(a.getExperienceYears() != null ? a.getExperienceYears() : 0, b.getExperienceYears() != null ? b.getExperienceYears() : 0);
                            break;
                        case "specialization":
                            comparison = (a.getSpecialization() != null ? a.getSpecialization() : "").compareTo(b.getSpecialization() != null ? b.getSpecialization() : "");
                            break;
                        case "languages":
                            comparison = (a.getLanguages() != null ? a.getLanguages() : "").compareTo(b.getLanguages() != null ? b.getLanguages() : "");
                            break;
                        case "rating":
                            comparison = Double.compare(a.getRating() != null ? a.getRating() : 0.0, b.getRating() != null ? b.getRating() : 0.0);
                            break;
                        case "isavailable":
                            comparison = Boolean.compare(a.getIsAvailable() != null ? a.getIsAvailable() : false, b.getIsAvailable() != null ? b.getIsAvailable() : false);
                            break;
                        default:
                            comparison = a.getGuideId().compareTo(b.getGuideId());
                    }
                    return sortDirection.equalsIgnoreCase("desc") ? -comparison : comparison;
                });
            }
            
            // Pagination
            int totalItems = tourGuides.size();
            int totalPages = (int) Math.ceil((double) totalItems / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalItems);
            
            List<TourGuideDTO> paginatedTourGuides = tourGuides.subList(startIndex, endIndex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", paginatedTourGuides);
            response.put("totalPages", totalPages);
            response.put("totalElements", totalItems);
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
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

    @GetMapping("/me")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<TourGuideDTO> getCurrentGuideDetails() {
        try {
            TourGuideDTO guideDetails = tourGuideService.getCurrentGuideDetails();
            return ResponseEntity.ok(guideDetails);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
