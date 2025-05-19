package com.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.api.dto.TourScheduleDTO;
import com.example.api.service.TourScheduleService;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class TourScheduleController {
    private static final Logger logger = LoggerFactory.getLogger(TourScheduleController.class);
    private final TourScheduleService service;

    @PostMapping("")
    public ResponseEntity<TourScheduleDTO> create(@Valid @RequestBody TourScheduleDTO dto) {
        TourScheduleDTO created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/schedules/" + created.getScheduleId()))
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourScheduleDTO> getById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("")
    public ResponseEntity<List<TourScheduleDTO>> getAll() {
        try {
            logger.info("Fetching all tour schedules");
            List<TourScheduleDTO> schedules = service.getAll();
            logger.info("Successfully fetched {} schedules", schedules.size());
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            logger.error("Error fetching all schedules", e);
            throw e;
        }
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<TourScheduleDTO>> getByTourId(@PathVariable("tourId") Integer tourId) {
        return ResponseEntity.ok(service.getByTourId(tourId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourScheduleDTO> update(@PathVariable("id") Integer id, @Valid @RequestBody TourScheduleDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}