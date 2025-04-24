
package com.example.api.service;

import com.example.api.dto.TourGuideDTO;
import com.example.api.model.TourGuide;
import com.example.api.repository.TourGuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourGuideService {

    @Autowired
    private TourGuideRepository tourGuideRepository;

    public TourGuideDTO createTourGuide(TourGuideDTO tourGuideDTO) {
        if (tourGuideDTO.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (tourGuideRepository.findByUserId(tourGuideDTO.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User ID " + tourGuideDTO.getUserId() + " is already associated with a tour guide");
        }
        TourGuide tourGuide = mapToEntity(tourGuideDTO);
        TourGuide savedTourGuide = tourGuideRepository.save(tourGuide);
        return mapToDTO(savedTourGuide);
    }

    public TourGuideDTO getTourGuideById(Integer id) {
        TourGuide tourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourGuide not found with id: " + id));
        return mapToDTO(tourGuide);
    }

    public List<TourGuideDTO> getAllTourGuides() {
        return tourGuideRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TourGuideDTO updateTourGuide(Integer id, TourGuideDTO tourGuideDTO) {
        if (tourGuideDTO.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        TourGuide existingTourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourGuide not found with id: " + id));
        if (!existingTourGuide.getUserId().equals(tourGuideDTO.getUserId())) {
            if (tourGuideRepository.findByUserId(tourGuideDTO.getUserId()).isPresent()) {
                throw new IllegalArgumentException("User ID " + tourGuideDTO.getUserId() + " is already associated with another tour guide");
            }
        }
        updateEntityFromDTO(existingTourGuide, tourGuideDTO);
        TourGuide updatedTourGuide = tourGuideRepository.save(existingTourGuide);
        return mapToDTO(updatedTourGuide);
    }

    public void deleteTourGuide(Integer id) {
        TourGuide tourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourGuide not found with id: " + id));
        tourGuideRepository.delete(tourGuide);
    }

    private TourGuide mapToEntity(TourGuideDTO dto) {
        TourGuide tourGuide = new TourGuide();
        tourGuide.setGuideId(dto.getGuideId());
        tourGuide.setUserId(dto.getUserId());
        tourGuide.setExperienceYears(dto.getExperienceYears());
        tourGuide.setSpecialization(dto.getSpecialization());
        tourGuide.setLanguages(dto.getLanguages());
        tourGuide.setRating(dto.getRating());
        return tourGuide;
    }

    private TourGuideDTO mapToDTO(TourGuide tourGuide) {
        TourGuideDTO dto = new TourGuideDTO();
        dto.setGuideId(tourGuide.getGuideId());
        dto.setUserId(tourGuide.getUserId());
        dto.setExperienceYears(tourGuide.getExperienceYears());
        dto.setSpecialization(tourGuide.getSpecialization());
        dto.setLanguages(tourGuide.getLanguages());
        dto.setRating(tourGuide.getRating());
        return dto;
    }

    private void updateEntityFromDTO(TourGuide tourGuide, TourGuideDTO dto) {
        tourGuide.setUserId(dto.getUserId());
        tourGuide.setExperienceYears(dto.getExperienceYears());
        tourGuide.setSpecialization(dto.getSpecialization());
        tourGuide.setLanguages(dto.getLanguages());
        tourGuide.setRating(dto.getRating());
    }
}
