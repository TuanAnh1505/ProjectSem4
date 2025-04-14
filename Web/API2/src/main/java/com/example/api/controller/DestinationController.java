package com.example.api.controller;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {
    @Autowired
    private DestinationService destinationService;

    //Create
    @PostMapping("/create")
    public ResponseEntity<DestinationDTO> create(@Valid @RequestBody DestinationDTO destinationDTO) {
        return ResponseEntity.ok(destinationService.createDestination(destinationDTO));
    }
    //Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO> getDestination(@PathVariable int id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));

    }
    //Get all
    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }
    //Update
    @PutMapping("/update/{id}")
    public ResponseEntity<DestinationDTO> updateDestination(@PathVariable int id,@Valid @RequestBody DestinationDTO destinationDTO) {
        return ResponseEntity.ok(destinationService.updateDestination(id, destinationDTO));
    }
    //Delete
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable int id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }
}
