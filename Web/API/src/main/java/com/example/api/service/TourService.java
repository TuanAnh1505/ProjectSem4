
package com.example.api.service;

import com.example.api.dto.TourDTO;
import com.example.api.model.Destination;
import com.example.api.model.Tour;
import com.example.api.model.TourStatus;
import com.example.api.repository.DestinationRepository;
import com.example.api.repository.TourRepository;
import com.example.api.repository.TourStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private TourStatusRepository tourStatusRepository;

    public TourDTO createTour(TourDTO tourDTO) {
        if (tourDTO.getName() == null || tourDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (tourDTO.getPrice() == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        Tour tour = mapToEntity(tourDTO);
        Tour savedTour = tourRepository.save(tour);
        return mapToDTO(savedTour);
    }

    public TourDTO getTourById(Integer id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
        return mapToDTO(tour);
    }

    public List<TourDTO> getAllTours() {
        return tourRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TourDTO updateTour(Integer id, TourDTO tourDTO) {
        if (tourDTO.getName() == null || tourDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (tourDTO.getPrice() == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
        updateEntityFromDTO(tour, tourDTO);
        Tour updatedTour = tourRepository.save(tour);
        return mapToDTO(updatedTour);
    }

    public void deleteTour(Integer id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
        tourRepository.delete(tour);
    }

    public List<TourDTO> searchTours(String name, Integer destinationId) {
        List<Tour> tours = tourRepository.findByNameAndDestination(name, destinationId);
        return tours.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private Tour mapToEntity(TourDTO dto) {
        Tour tour = new Tour();
        tour.setTourId(dto.getTourId());
        tour.setName(dto.getName());
        tour.setDescription(dto.getDescription());
        tour.setPrice(dto.getPrice());
        tour.setDuration(dto.getDuration());
        tour.setMaxParticipants(dto.getMaxParticipants());
        if (dto.getDestinationId() != null) {
            Destination destination = destinationRepository.findById(dto.getDestinationId())
                    .orElseThrow(() -> new RuntimeException("Destination not found with id: " + dto.getDestinationId()));
            tour.setDestination(destination);
        }
        if (dto.getStatusId() != null) {
            TourStatus status = tourStatusRepository.findById(dto.getStatusId())
                    .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + dto.getStatusId()));
            tour.setStatus(status);
        }
        return tour;
    }

    private TourDTO mapToDTO(Tour tour) {
        TourDTO dto = new TourDTO();
        dto.setTourId(tour.getTourId());
        dto.setName(tour.getName());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setDuration(tour.getDuration());
        dto.setMaxParticipants(tour.getMaxParticipants());
        if (tour.getDestination() != null) {
            dto.setDestinationId(tour.getDestination().getDestinationId());
        }
        if (tour.getStatus() != null) {
            dto.setStatusId(tour.getStatus().getTourStatusId());
        }
        return dto;
    }

    private void updateEntityFromDTO(Tour tour, TourDTO dto) {
        tour.setName(dto.getName());
        tour.setDescription(dto.getDescription());
        tour.setPrice(dto.getPrice());
        tour.setDuration(dto.getDuration());
        tour.setMaxParticipants(dto.getMaxParticipants());
        if (dto.getDestinationId() != null) {
            Destination destination = destinationRepository.findById(dto.getDestinationId())
                    .orElseThrow(() -> new RuntimeException("Destination not found with id: " + dto.getDestinationId()));
            tour.setDestination(destination);
        }
        if (dto.getStatusId() != null) {
            TourStatus status = tourStatusRepository.findById(dto.getStatusId())
                    .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + dto.getStatusId()));
            tour.setStatus(status);
        }
    }
}
