package com.example.api.controller;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<DestinationDTO> createDestination(@Valid @RequestBody DestinationDTO destinationDTO) {
        Destination destination = destinationService.createDestination(destinationDTO);
        DestinationDTO createdDto = new DestinationDTO();
        createdDto.setDestinationId(destination.getDestinationId());
        createdDto.setName(destination.getName());
        createdDto.setCategory(destination.getCategory());
        createdDto.setFileType(destination.getFileType().name());
        createdDto.setDescription(destination.getDescription());
        createdDto.setLocation(destination.getLocation());
        createdDto.setRating(destination.getRating());
        return ResponseEntity.ok(createdDto);
    }

    // READ all
    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        List<DestinationDTO> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    // READ by ID
    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO> getDestinationById(@PathVariable Integer id) {
        Optional<DestinationDTO> destination = destinationService.getDestinationById(id);
        return destination.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<DestinationDTO> updateDestination(@PathVariable Integer id, @Valid @RequestBody DestinationDTO destinationDTO) {
        DestinationDTO updatedDestination = destinationService.updateDestination(id, destinationDTO);
        return ResponseEntity.ok(updatedDestination);
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Integer id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }
}