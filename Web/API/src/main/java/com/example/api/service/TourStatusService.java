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
        TourStatus tourStatus =mapToEntity(tourStatusDTO);
        TourStatus savedTourStatus = tourStatusRepository.save(tourStatus);
        return mapToDTO(savedTourStatus);
    }
    public List<TourStatusDTO> getAllTourStatus() {
        return tourStatusRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    public TourStatusDTO updateTourStatus(Integer id, TourStatusDTO tourStatusDTO) {
        TourStatus tourStatus = tourStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + id));
        updateEntityFromDTO(tourStatus, tourStatusDTO);
        TourStatus updatedTourStatus = tourStatusRepository.save(tourStatus);
        return mapToDTO(updatedTourStatus);
    }
    public void deleteTourStatus(Integer id) {
        TourStatus tourStatus = tourStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + id));
//        if (!tourRepository.findByStatus(tourStatus).isEmpty()) {
//            throw new RuntimeException("Cannot delete TourStatus as it is referenced by Tours");
//        }
        tourStatusRepository.delete(tourStatus);
    }
    private TourStatus mapToEntity(TourStatusDTO dto) {
        TourStatus tourStatus = new TourStatus();
        tourStatus.setTourstatusid(dto.getTourstatusid());
        tourStatus.setStatusname(dto.getStatusname());
        return tourStatus;
    }
    private TourStatusDTO mapToDTO(TourStatus tourStatus) {
        TourStatusDTO dto = new TourStatusDTO();
        dto.setTourstatusid(tourStatus.getTourstatusid());
        dto.setStatusname(tourStatus.getStatusname());
        return dto;
    }
    private void updateEntityFromDTO(TourStatus tourStatus, TourStatusDTO dto) {
        tourStatus.setStatusname(dto.getStatusname());
    }
}
