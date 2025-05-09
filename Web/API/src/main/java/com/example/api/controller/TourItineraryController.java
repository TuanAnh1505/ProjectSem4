package com.example.api.controller;

import com.example.api.dto.TourItineraryDTO;
import com.example.api.service.TourItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TourItineraryController {

    @Autowired
    private TourItineraryService itineraryService;

    @PostMapping
    public ResponseEntity<TourItineraryDTO> create(@RequestBody TourItineraryDTO dto) {
        return ResponseEntity.ok(itineraryService.createItinerary(dto));
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<TourItineraryDTO>> getByTour(@PathVariable Integer tourId) {
        return ResponseEntity.ok(itineraryService.getItinerariesByTourId(tourId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourItineraryDTO> detail(@PathVariable Integer id) {
        return ResponseEntity.ok(itineraryService.getItineraryDetail(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourItineraryDTO> update(@PathVariable Integer id, @RequestBody TourItineraryDTO dto) {
        dto.setItineraryId(id);
        return ResponseEntity.ok(itineraryService.updateItinerary(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        itineraryService.deleteItinerary(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<TourItineraryDTO>> getAllItineraries() {
        return ResponseEntity.ok(itineraryService.getAllItineraries());
    }
}
