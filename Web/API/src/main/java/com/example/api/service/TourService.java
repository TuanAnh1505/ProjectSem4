package com.example.api.service;

import com.example.api.dto.TourDTO;
import com.example.api.model.Destination;
import com.example.api.model.Event;
import com.example.api.model.Tour;
import com.example.api.model.TourStatus;
import com.example.api.repository.DestinationRepository;
import com.example.api.repository.EventRepository;
import com.example.api.repository.TourRepository;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
public class TourService {

    private final TourRepository tourRepo;
    private final DestinationRepository destRepo;
    private final EventRepository eventRepo;
    @PersistenceContext
    private EntityManager entityManager;

    public Tour createTour(TourDTO dto) {
        Tour tour = new Tour();
        BeanUtils.copyProperties(dto, tour);
        if (dto.getImageUrls() != null) {
            tour.setImageUrls(dto.getImageUrls());
        }
        tour.setDestinations(destRepo.findAllById(dto.getDestinationIds() != null ? dto.getDestinationIds() : Collections.emptyList()));
        tour.setEvents(eventRepo.findAllById(dto.getEventIds() != null ? dto.getEventIds() : Collections.emptyList()));
        return tourRepo.save(tour);
    }

    public Tour updateTour(Integer id, TourDTO dto) {
        Tour tour = tourRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        BeanUtils.copyProperties(dto, tour, "tourId");
        if (dto.getImageUrls() != null) {
            tour.setImageUrls(dto.getImageUrls());
        }
        tour.setDestinations(destRepo.findAllById(dto.getDestinationIds() != null ? dto.getDestinationIds() : Collections.emptyList()));
        tour.setEvents(eventRepo.findAllById(dto.getEventIds() != null ? dto.getEventIds() : Collections.emptyList()));
        return tourRepo.save(tour);
    }

    public void deleteTour(Integer id) {
        tourRepo.deleteById(id);
    }

    public Tour getTourDetail(Integer id) {
        return tourRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
    }

    public List<Tour> getAllTours() {
        return tourRepo.findAll();
    }

    public List<Tour> getRandomTours(int count, Integer excludeTourId) {
        String sql = "SELECT * FROM tours WHERE tour_id <> :excludeTourId ORDER BY RAND() LIMIT " + count;
        return entityManager.createNativeQuery(sql, Tour.class)
                .setParameter("excludeTourId", excludeTourId)
                .getResultList();
    }

    public List<Destination> getTourDestinations(Integer tourId) {
        return tourRepo.findById(tourId)
            .map(Tour::getDestinations)
            .orElse(Collections.emptyList());
    }

    public List<Event> getTourEvents(Integer tourId) {
        return tourRepo.findById(tourId)
            .map(Tour::getEvents)
            .orElse(Collections.emptyList());
    }
}
