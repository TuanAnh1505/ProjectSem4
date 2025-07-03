package com.example.api.controller;

import com.example.api.dto.DestinationDTO;
import com.example.api.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<DestinationDTO> createDestination(
            @Valid @ModelAttribute DestinationDTO destinationDTO,
            @RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one file is required");
        }

        
        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (!contentType.startsWith("image/") && !contentType.equals("video/mp4")
                    && !contentType.equals("video/quicktime")) {
                throw new IllegalArgumentException("Invalid file type: " + contentType);
            }
        }

        DestinationDTO createdDestination = destinationService.createDestination(destinationDTO, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDestination);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO> getDestinationById(@PathVariable Integer id) {
        try {
            DestinationDTO destination = destinationService.getDestinationById(id);
            return ResponseEntity.ok(destination);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        List<DestinationDTO> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/update/{id}")
    public ResponseEntity<DestinationDTO> getDestinationForUpdate(@PathVariable Integer id) {
        try {
            DestinationDTO destination = destinationService.getDestinationById(id);
            return ResponseEntity.ok(destination);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<DestinationDTO> updateDestination(
            @PathVariable Integer id,
            @ModelAttribute DestinationDTO destinationDTO,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            DestinationDTO updatedDestination = destinationService.updateDestination(id, destinationDTO, files);
            return ResponseEntity.ok(updatedDestination);
        } catch (Exception e) {
            throw new RuntimeException("Error updating destination: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Integer id) {
        boolean deleted = destinationService.deleteDestination(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }
}