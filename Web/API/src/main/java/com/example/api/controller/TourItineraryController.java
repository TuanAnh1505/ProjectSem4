package com.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.api.dto.TourItineraryDTO;
import com.example.api.service.TourItineraryService;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/itineraries")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, 
             allowedHeaders = {"Authorization", "Content-Type"},
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TourItineraryController {
    private static final Logger logger = LoggerFactory.getLogger(TourItineraryController.class);
    private final TourItineraryService service;

    @PostMapping("")
    public ResponseEntity<TourItineraryDTO> create(@Valid @RequestBody TourItineraryDTO dto) {
        try {
            logger.info("Creating new itinerary: {}", dto);
            TourItineraryDTO created = service.create(dto);
            return ResponseEntity.created(URI.create("/api/itineraries/" + created.getItineraryId()))
                    .body(created);
        } catch (Exception e) {
            logger.error("Error creating itinerary", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to create itinerary: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourItineraryDTO> getById(@PathVariable("id") Integer id) {
        try {
            logger.info("Fetching itinerary with id: {}", id);
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            logger.error("Error fetching itinerary with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to fetch itinerary: " + e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<List<TourItineraryDTO>> getAll() {
        try {
            logger.info("Fetching all itineraries");
            List<TourItineraryDTO> itineraries = service.getAll();
            logger.info("Successfully fetched {} itineraries", itineraries.size());
            return ResponseEntity.ok(itineraries);
        } catch (Exception e) {
            logger.error("Error fetching all itineraries", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to fetch itineraries: " + e.getMessage());
        }
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<TourItineraryDTO>> getByScheduleId(@PathVariable("scheduleId") Integer scheduleId) {
        try {
            logger.info("Fetching itineraries for schedule id: {}", scheduleId);
            return ResponseEntity.ok(service.getByScheduleId(scheduleId));
        } catch (Exception e) {
            logger.error("Error fetching itineraries for schedule id: {}", scheduleId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to fetch itineraries: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourItineraryDTO> update(@PathVariable("id") Integer id, @Valid @RequestBody TourItineraryDTO dto) {
        try {
            logger.info("Updating itinerary with id: {}", id);
            return ResponseEntity.ok(service.update(id, dto));
        } catch (Exception e) {
            logger.error("Error updating itinerary with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to update itinerary: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        try {
            logger.info("Deleting itinerary with id: {}", id);
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting itinerary with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to delete itinerary: " + e.getMessage());
        }
    }
}