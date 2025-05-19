package com.example.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.api.model.TourItinerary;
import com.example.api.dto.TourItineraryDTO;
import com.example.api.repository.TourItineraryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourItineraryService {
    private static final Logger logger = LoggerFactory.getLogger(TourItineraryService.class);
    private final TourItineraryRepository repository;

    @Transactional
    public TourItineraryDTO create(TourItineraryDTO dto) {
        try {
            logger.info("Creating new itinerary with data: {}", dto);
            validateTimes(dto);
            TourItinerary entity = mapToEntity(dto);
            TourItinerary saved = repository.save(entity);
            logger.info("Successfully created itinerary with id: {}", saved.getItineraryId());
            return mapToDTO(saved);
        } catch (Exception e) {
            logger.error("Error creating itinerary", e);
            throw new RuntimeException("Failed to create itinerary: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public TourItineraryDTO getById(Integer id) {
        try {
            logger.info("Fetching itinerary with id: {}", id);
            TourItinerary entity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tour itinerary not found with id: " + id));
            return mapToDTO(entity);
        } catch (Exception e) {
            logger.error("Error fetching itinerary with id: {}", id, e);
            throw new RuntimeException("Failed to fetch itinerary: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<TourItineraryDTO> getByScheduleId(Integer scheduleId) {
        try {
            logger.info("Fetching itineraries for schedule id: {}", scheduleId);
            List<TourItinerary> entities = repository.findByScheduleId(scheduleId);
            logger.info("Found {} itineraries for schedule id: {}", entities.size(), scheduleId);
            return entities.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching itineraries for schedule id: {}", scheduleId, e);
            throw new RuntimeException("Failed to fetch itineraries: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<TourItineraryDTO> getAll() {
        try {
            logger.info("Fetching all itineraries");
            List<TourItinerary> entities = repository.findAll();
            logger.info("Found {} itineraries", entities.size());
            return entities.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all itineraries", e);
            throw new RuntimeException("Failed to fetch itineraries: " + e.getMessage());
        }
    }

    @Transactional
    public TourItineraryDTO update(Integer id, TourItineraryDTO dto) {
        try {
            logger.info("Updating itinerary with id: {}", id);
            TourItinerary entity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tour itinerary not found with id: " + id));
            validateTimes(dto);
            mapToEntity(dto, entity);
            TourItinerary updated = repository.save(entity);
            logger.info("Successfully updated itinerary with id: {}", id);
            return mapToDTO(updated);
        } catch (Exception e) {
            logger.error("Error updating itinerary with id: {}", id, e);
            throw new RuntimeException("Failed to update itinerary: " + e.getMessage());
        }
    }

    @Transactional
    public void delete(Integer id) {
        try {
            logger.info("Deleting itinerary with id: {}", id);
            if (!repository.existsById(id)) {
                throw new IllegalArgumentException("Tour itinerary not found with id: " + id);
            }
            repository.deleteById(id);
            logger.info("Successfully deleted itinerary with id: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting itinerary with id: {}", id, e);
            throw new RuntimeException("Failed to delete itinerary: " + e.getMessage());
        }
    }

    private void validateTimes(TourItineraryDTO dto) {
        if (dto.getStartTime() != null && dto.getEndTime() != null && dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }
    }

    private TourItineraryDTO mapToDTO(TourItinerary entity) {
        try {
            TourItineraryDTO dto = new TourItineraryDTO();
            dto.setItineraryId(entity.getItineraryId());
            dto.setScheduleId(entity.getScheduleId());
            dto.setTitle(entity.getTitle());
            dto.setDescription(entity.getDescription());
            dto.setStartTime(entity.getStartTime());
            dto.setEndTime(entity.getEndTime());
            dto.setType(entity.getType());
            return dto;
        } catch (Exception e) {
            logger.error("Error mapping entity to DTO", e);
            throw new RuntimeException("Failed to map entity to DTO: " + e.getMessage());
        }
    }

    private TourItinerary mapToEntity(TourItineraryDTO dto) {
        try {
            TourItinerary entity = new TourItinerary();
            mapToEntity(dto, entity);
            return entity;
        } catch (Exception e) {
            logger.error("Error mapping DTO to entity", e);
            throw new RuntimeException("Failed to map DTO to entity: " + e.getMessage());
        }
    }

    private void mapToEntity(TourItineraryDTO dto, TourItinerary entity) {
        try {
            entity.setScheduleId(dto.getScheduleId());
            entity.setTitle(dto.getTitle());
            entity.setDescription(dto.getDescription());
            entity.setStartTime(dto.getStartTime());
            entity.setEndTime(dto.getEndTime());
            entity.setType(dto.getType());
        } catch (Exception e) {
            logger.error("Error mapping DTO to entity", e);
            throw new RuntimeException("Failed to map DTO to entity: " + e.getMessage());
        }
    }
}