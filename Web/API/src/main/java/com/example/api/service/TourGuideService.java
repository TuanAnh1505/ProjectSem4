package com.example.api.service;

import com.example.api.dto.TourGuideDTO;
import com.example.api.model.TourGuide;
import com.example.api.model.User;
import com.example.api.repository.TourGuideRepository;
import com.example.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TourGuideService {

    @Autowired
    private TourGuideRepository tourGuideRepository;

    @Autowired
    private UserRepository userRepository;

    public TourGuideDTO createTourGuide(TourGuideDTO tourGuideDTO) {
        // Check if user exists
        User user = userRepository.findById(tourGuideDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + tourGuideDTO.getUserId()));

        // Check if user is already a tour guide
        if (tourGuideRepository.existsByUserId(tourGuideDTO.getUserId())) {
            throw new IllegalStateException("User is already a tour guide");
        }

        TourGuide tourGuide = new TourGuide();
        tourGuide.setUserId(tourGuideDTO.getUserId());
        tourGuide.setExperienceYears(tourGuideDTO.getExperienceYears());
        tourGuide.setSpecialization(tourGuideDTO.getSpecialization());
        tourGuide.setLanguages(tourGuideDTO.getLanguages());
        tourGuide.setRating(tourGuideDTO.getRating() != null ? tourGuideDTO.getRating() : 0.0);

        TourGuide savedTourGuide = tourGuideRepository.save(tourGuide);
        return convertToDTO(savedTourGuide);
    }

    public TourGuideDTO getTourGuideById(Long id) {
        TourGuide tourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + id));
        return convertToDTO(tourGuide);
    }

    public List<TourGuideDTO> getAllTourGuides() {
        return tourGuideRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TourGuideDTO updateTourGuide(Long id, TourGuideDTO tourGuideDTO) {
        TourGuide tourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + id));

        // Update fields
        if (tourGuideDTO.getExperienceYears() != null) {
            tourGuide.setExperienceYears(tourGuideDTO.getExperienceYears());
        }
        if (tourGuideDTO.getSpecialization() != null) {
            tourGuide.setSpecialization(tourGuideDTO.getSpecialization());
        }
        if (tourGuideDTO.getLanguages() != null) {
            tourGuide.setLanguages(tourGuideDTO.getLanguages());
        }
        if (tourGuideDTO.getRating() != null) {
            tourGuide.setRating(tourGuideDTO.getRating());
        }

        TourGuide updatedTourGuide = tourGuideRepository.save(tourGuide);
        return convertToDTO(updatedTourGuide);
    }

    public void deleteTourGuide(Long id) {
        if (!tourGuideRepository.existsById(id)) {
            throw new EntityNotFoundException("Tour guide not found with id: " + id);
        }
        tourGuideRepository.deleteById(id);
    }

    public List<TourGuideDTO> findByMinRating(Double minRating) {
        return tourGuideRepository.findByMinRating(minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findByMinExperience(Integer minExperience) {
        return tourGuideRepository.findByMinExperience(minExperience).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findBySpecialization(String specialization) {
        return tourGuideRepository.findBySpecializationContaining(specialization).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findByLanguage(String language) {
        return tourGuideRepository.findByLanguageContaining(language).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TourGuideDTO convertToDTO(TourGuide tourGuide) {
        TourGuideDTO dto = new TourGuideDTO();
        dto.setGuideId(tourGuide.getGuideId());
        dto.setUserId(tourGuide.getUserId());
        dto.setExperienceYears(tourGuide.getExperienceYears());
        dto.setSpecialization(tourGuide.getSpecialization());
        dto.setLanguages(tourGuide.getLanguages());
        dto.setRating(tourGuide.getRating());
        dto.setCreatedAt(tourGuide.getCreatedAt());
        return dto;
    }
}
