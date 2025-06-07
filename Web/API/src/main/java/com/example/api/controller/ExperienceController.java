package com.example.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.api.repository.ExperienceRepository;
import com.example.api.model.Experience;
import com.example.api.repository.MediaRepository;
import com.example.api.dto.ExperienceWithMediaDTO;
import org.springframework.beans.BeanUtils;
import java.util.ArrayList;
import com.example.api.dto.ExperienceCreateDTO;
import com.example.api.model.User;
import com.example.api.repository.UserRepository;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import com.example.api.repository.TourRepository;
import com.example.api.model.Tour;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {
    @Autowired
    private ExperienceRepository experienceRepo;

    @Autowired
    private MediaRepository mediaRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TourRepository tourRepo;

    @PostMapping
    public Map<String, Object> createExperience(@RequestBody ExperienceCreateDTO dto) {
        Experience exp = new Experience();
        exp.setTitle(dto.getTitle());
        exp.setContent(dto.getContent());
        User user = userRepo.findById(dto.getUserid()).orElseThrow();
        Tour tour = tourRepo.findById(dto.getTourId().intValue()).orElseThrow();
        exp.setUser(user);
        exp.setTour(tour);
        Experience saved = experienceRepo.save(exp);

        Map<String, Object> result = new HashMap<>();
        result.put("experienceId", saved.getExperienceId());
        result.put("userPublicId", user.getPublicId());
        return result;
    }

    @GetMapping
    public List<Experience> getAll() {
        return experienceRepo.findAll();
    }

    @GetMapping("/{id}")
    public Experience getById(@PathVariable Long id) {
        return experienceRepo.findById(id).orElse(null);
    }

    @GetMapping("/tour/{tourId}")
    public List<ExperienceWithMediaDTO> getByTourId(@PathVariable Long tourId) {
        List<Experience> experiences = experienceRepo.findByTour_TourIdAndStatus(tourId, "approved");
        List<ExperienceWithMediaDTO> result = new ArrayList<>();
        for (Experience exp : experiences) {
            ExperienceWithMediaDTO dto = new ExperienceWithMediaDTO();
            BeanUtils.copyProperties(exp, dto);
            dto.setMedia(mediaRepo.findByExperienceId(exp.getExperienceId()));
            dto.setUserPublicId(exp.getUser().getPublicId());
            dto.setUserFullName(exp.getUser().getFullName());
            result.add(dto);
        }
        return result;
    }

    @GetMapping("/approved")
    public List<Experience> getAllApproved() {
        return experienceRepo.findByStatus("approved");
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveExperience(@PathVariable Long id) {
        Experience exp = experienceRepo.findById(id).orElseThrow();
        exp.setStatus("approved");
        experienceRepo.save(exp);
        return ResponseEntity.ok("Đã duyệt");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectExperience(@PathVariable Long id) {
        Experience exp = experienceRepo.findById(id).orElseThrow();
        exp.setStatus("rejected");
        experienceRepo.save(exp);
        return ResponseEntity.ok("Đã từ chối");
    }
}
