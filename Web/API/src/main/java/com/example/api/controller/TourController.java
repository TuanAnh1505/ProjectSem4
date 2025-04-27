
package com.example.api.controller;

import com.example.api.dto.TourDTO;
import com.example.api.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    private TourService tourService;

    @PostMapping
    public ResponseEntity<TourDTO> createTour(@RequestBody TourDTO tourDTO) {
        TourDTO createdTour = tourService.createTour(tourDTO);
        return ResponseEntity.ok(createdTour);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDTO> getTourById(@PathVariable Integer id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour);
    }

    @GetMapping
    public ResponseEntity<List<TourDTO>> getAllTours() {
        List<TourDTO> tours = tourService.getAllTours();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TourDTO>> searchTours(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "destinationId", required = false) Integer destinationId) {
        List<TourDTO> tours = tourService.searchTours(name, destinationId);
        return ResponseEntity.ok(tours);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourDTO> updateTour(@PathVariable Integer id, @RequestBody TourDTO tourDTO) {
        TourDTO updatedTour = tourService.updateTour(id, tourDTO);
        return ResponseEntity.ok(updatedTour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Integer id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
}
