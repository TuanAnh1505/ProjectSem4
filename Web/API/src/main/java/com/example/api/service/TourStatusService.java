package com.example.api.service;

import com.example.api.dto.TourStatusDTO;
import com.example.api.model.TourStatus;
import com.example.api.repository.TourStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourStatusService {

    @Autowired
    private TourStatusRepository tourStatusRepository;

    public TourStatusDTO createTourStatus(TourStatusDTO tourStatusDTO) {
        if (tourStatusDTO.getStatusName() == null || tourStatusDTO.getStatusName().trim().isEmpty()) {
            throw new IllegalArgumentException("Status name cannot be null or empty");
        }
        TourStatus tourStatus = mapToEntity(tourStatusDTO);
        TourStatus savedTourStatus = tourStatusRepository.save(tourStatus);
        return mapToDTO(savedTourStatus);
    }

    public TourStatusDTO getTourStatusById(Integer id) {
        TourStatus tourStatus = tourStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + id));
        return mapToDTO(tourStatus);
    }

    public List<TourStatusDTO> getAllTourStatuses() {
        return tourStatusRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TourStatusDTO updateTourStatus(Integer id, TourStatusDTO tourStatusDTO) {
        if (tourStatusDTO.getStatusName() == null || tourStatusDTO.getStatusName().trim().isEmpty()) {
            throw new IllegalArgumentException("Status name cannot be null or empty");
        }
        TourStatus tourStatus = tourStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + id));
        updateEntityFromDTO(tourStatus, tourStatusDTO);
        TourStatus updatedTourStatus = tourStatusRepository.save(tourStatus);
        return mapToDTO(updatedTourStatus);
    }

    public void deleteTourStatus(Integer id) {
        TourStatus tourStatus = tourStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + id));
        tourStatusRepository.delete(tourStatus);
    }

    private TourStatus mapToEntity(TourStatusDTO dto) {
        TourStatus tourStatus = new TourStatus();
        tourStatus.setTourStatusId(dto.getTourStatusId());
        tourStatus.setStatusName(dto.getStatusName());
        return tourStatus;
    }

    private TourStatusDTO mapToDTO(TourStatus tourStatus) {
        TourStatusDTO dto = new TourStatusDTO();
        dto.setTourStatusId(tourStatus.getTourStatusId());
        dto.setStatusName(tourStatus.getStatusName());
        return dto;
    }

    private void updateEntityFromDTO(TourStatus tourStatus, TourStatusDTO dto) {
        tourStatus.setStatusName(dto.getStatusName());
    }
}
