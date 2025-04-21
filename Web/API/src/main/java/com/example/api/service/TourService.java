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
    public List<TourDTO> searchTours(String name, Integer destinationid) {
        List<Tour> tours = tourRepository.findByNameAndDestination(name, destinationid);
        return tours.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    private Tour mapToEntity(TourDTO dto) {
        Tour tour = new Tour();
        tour.setTourid(dto.getTourid());
        tour.setName(dto.getName());
        tour.setDescription(dto.getDescription());
        tour.setPrice(dto.getPrice());
        tour.setDuration(dto.getDuration());
        tour.setMaxparticipants(dto.getMaxparticipants());
        if (dto.getDestinationid() != null) {
            Destination destination = destinationRepository.findById(dto.getDestinationid())
                    .orElseThrow(() -> new RuntimeException("Destination not found with id: " + dto.getDestinationid()));
            tour.setDestination(destination);
        }
        if (dto.getStatusid() != null) {
            TourStatus status = tourStatusRepository.findById(dto.getStatusid())
                    .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + dto.getStatusid()));
            tour.setStatus(status);
        }
        return tour;
    }

    private TourDTO mapToDTO(Tour tour) {
        TourDTO dto = new TourDTO();
        dto.setTourid(tour.getTourid());
        dto.setName(tour.getName());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setDuration(tour.getDuration());
        dto.setMaxparticipants(tour.getMaxparticipants());
        if (tour.getDestination() != null) {
            dto.setDestinationid(tour.getDestination().getDestinationid());
        }
        if (tour.getStatus() != null) {
            dto.setStatusid(tour.getStatus().getTourstatusid());
        }
        return dto;
    }

    private void updateEntityFromDTO(Tour tour, TourDTO dto) {
        tour.setName(dto.getName());
        tour.setDescription(dto.getDescription());
        tour.setPrice(dto.getPrice());
        tour.setDuration(dto.getDuration());
        tour.setMaxparticipants(dto.getMaxparticipants());
        if (dto.getDestinationid() != null) {
            Destination destination = destinationRepository.findById(dto.getDestinationid())
                    .orElseThrow(() -> new RuntimeException("Destination not found with id: " + dto.getDestinationid()));
            tour.setDestination(destination);
        }
        if (dto.getStatusid() != null) {
            TourStatus status = tourStatusRepository.findById(dto.getStatusid())
                    .orElseThrow(() -> new RuntimeException("TourStatus not found with id: " + dto.getStatusid()));
            tour.setStatus(status);
        }
    }

}
