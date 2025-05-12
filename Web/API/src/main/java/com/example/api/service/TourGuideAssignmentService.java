package com.example.api.service;

import com.example.api.dto.TourGuideAssignmentDTO;
import com.example.api.model.Tour;
import com.example.api.model.TourGuide;
import com.example.api.model.TourGuideAssignment;
import com.example.api.repository.TourGuideAssignmentRepository;
import com.example.api.repository.TourGuideRepository;
import com.example.api.repository.TourRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TourGuideAssignmentService {

    @Autowired
    private TourGuideAssignmentRepository assignmentRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TourGuideRepository tourGuideRepository;

    public TourGuideAssignmentDTO createAssignment(Integer tourId, Integer guideId) {
        // Check if tour exists
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found with id: " + tourId));

        // Check if guide exists
        TourGuide guide = tourGuideRepository.findById(guideId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + guideId));

        // Check if assignment already exists
        if (assignmentRepository.existsByTourIdAndGuideId(tourId, guideId)) {
            throw new IllegalStateException("Assignment already exists for tour " + tourId + " and guide " + guideId);
        }

        TourGuideAssignment assignment = new TourGuideAssignment();
        assignment.setTourId(tourId);
        assignment.setGuideId(guideId);

        TourGuideAssignment savedAssignment = assignmentRepository.save(assignment);
        return convertToDTO(savedAssignment);
    }

    public List<TourGuideAssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByTourId(Integer tourId) {
        return assignmentRepository.findByTourId(tourId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByGuideId(Integer guideId) {
        return assignmentRepository.findByGuideId(guideId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByTourIdAndGuideMinRating(Integer tourId, Double minRating) {
        return assignmentRepository.findByTourIdAndGuideMinRating(tourId, minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByGuideIdAndTourStatus(Integer guideId, String statusName) {
        return assignmentRepository.findByGuideIdAndTourStatus(guideId, statusName).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteAssignment(Integer tourId, Integer guideId) {
        if (!assignmentRepository.existsByTourIdAndGuideId(tourId, guideId)) {
            throw new EntityNotFoundException("Assignment not found for tour " + tourId + " and guide " + guideId);
        }
        assignmentRepository.deleteByTourIdAndGuideId(tourId, guideId);
    }

    private TourGuideAssignmentDTO convertToDTO(TourGuideAssignment assignment) {
        TourGuideAssignmentDTO dto = new TourGuideAssignmentDTO();
        dto.setTourId(assignment.getTourId());
        dto.setGuideId(assignment.getGuideId());
        dto.setCreatedAt(assignment.getCreatedAt());

        // Set tour information if available
        if (assignment.getTour() != null) {
            Tour tour = assignment.getTour();
            dto.setTourName(tour.getName());
            dto.setTourDescription(tour.getDescription());
        }

        // Set guide information if available
        if (assignment.getGuide() != null) {
            TourGuide guide = assignment.getGuide();
            dto.setGuideName(guide.getUser() != null ? guide.getUser().getFullName() : null);
            dto.setGuideSpecialization(guide.getSpecialization());
            dto.setGuideLanguages(guide.getLanguages());
            dto.setGuideRating(guide.getRating());
        }

        return dto;
    }
} 