package com.example.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.example.api.model.TourStatus;
import com.example.api.repository.TourStatusRepository;

import java.util.List;

@RestController
@RequestMapping("/api/tour-status")
@RequiredArgsConstructor
public class TourStatusController {

    private final TourStatusRepository tourStatusRepository;

    @GetMapping
    public List<TourStatus> getAll() {
        return tourStatusRepository.findAll();
    }

    @PostMapping
    public TourStatus create(@RequestBody TourStatus status) {
        return tourStatusRepository.save(status);
    }

    @PutMapping("/{id}")
    public TourStatus update(@PathVariable Integer id, @RequestBody TourStatus status) {
        status.setTourStatusId(id);
        return tourStatusRepository.save(status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        tourStatusRepository.deleteById(id);
    }
}