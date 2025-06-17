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

    public TourGuideAssignmentDTO createAssignment(TourGuideAssignmentDTO dto) {
        // Check if tour exists
        Tour tour = tourRepository.findById(dto.getTourId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found with id: " + dto.getTourId()));

        // Check if guide exists
        TourGuide guide = tourGuideRepository.findById(dto.getGuideId().longValue())
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + dto.getGuideId()));

        // Check if guide is available
        if (!guide.getIsAvailable()) {
            throw new IllegalStateException("Hướng dẫn viên hiện không sẵn sàng!");
        }

        // Check if dates are valid
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc!");
        }

        // Check if guide has already been assigned to this tour & schedule
        boolean alreadyAssigned = assignmentRepository.findByTourId(dto.getTourId()).stream()
            .anyMatch(a -> a.getGuideId().equals(dto.getGuideId()) &&
                          a.getStartDate().equals(dto.getStartDate()) &&
                          a.getEndDate().equals(dto.getEndDate()));
        if (alreadyAssigned) {
            throw new IllegalStateException("Hướng dẫn viên đã được gán vào lịch trình này!");
        }

        // Check if guide has any overlapping assignments
        if (assignmentRepository.existsOverlappingAssignment(
                dto.getGuideId(),
                dto.getStartDate(),
                dto.getEndDate())) {
            throw new IllegalStateException("Hướng dẫn viên đã có tour khác trong khoảng thời gian này!");
        }

        TourGuideAssignment assignment = new TourGuideAssignment();
        assignment.setTourId(dto.getTourId());
        assignment.setGuideId(dto.getGuideId());
        assignment.setRole(dto.getRole());
        assignment.setStartDate(dto.getStartDate());
        assignment.setEndDate(dto.getEndDate());
        assignment.setStatus(TourGuideAssignment.AssignmentStatus.assigned);

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

    public TourGuideAssignmentDTO updateAssignmentStatus(Integer assignmentId, TourGuideAssignment.AssignmentStatus newStatus) {
        TourGuideAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));

        assignment.setStatus(newStatus);
        TourGuideAssignment updatedAssignment = assignmentRepository.save(assignment);
        return convertToDTO(updatedAssignment);
    }

    public void deleteAssignment(Integer assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new EntityNotFoundException("Assignment not found with id: " + assignmentId);
        }
        assignmentRepository.deleteById(assignmentId);
    }

    private TourGuideAssignmentDTO convertToDTO(TourGuideAssignment assignment) {
        TourGuideAssignmentDTO dto = new TourGuideAssignmentDTO();
        dto.setAssignmentId(assignment.getAssignmentId());
        dto.setTourId(assignment.getTourId());
        dto.setGuideId(assignment.getGuideId());
        dto.setRole(assignment.getRole());
        dto.setStartDate(assignment.getStartDate());
        dto.setEndDate(assignment.getEndDate());
        dto.setStatus(assignment.getStatus());

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