package com.example.api.controller;

import com.example.api.dto.DestinationDTO;
import com.example.api.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    // Create a new destination
    @PostMapping
    public ResponseEntity<DestinationDTO> createDestination(@RequestBody DestinationDTO destinationDTO) {
        DestinationDTO createdDestination = destinationService.createDestination(destinationDTO);
        return ResponseEntity.ok(createdDestination);
    }

    // Get a destination by ID
    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO> getDestinationById(@PathVariable Integer id) {
        DestinationDTO destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(destination);
    }

    // Get all destinations
    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        List<DestinationDTO> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    // Update a destination
    @PutMapping("/{id}")
    public ResponseEntity<DestinationDTO> updateDestination(@PathVariable Integer id, @RequestBody DestinationDTO destinationDTO) {
        DestinationDTO updatedDestination = destinationService.updateDestination(id, destinationDTO);
        return ResponseEntity.ok(updatedDestination);
    }

    // Delete a destination
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Integer id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }
}