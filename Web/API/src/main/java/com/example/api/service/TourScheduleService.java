package com.example.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.api.dto.TourScheduleDTO;
import com.example.api.model.TourSchedule;
import com.example.api.repository.TourScheduleRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(TourScheduleService.class);
    private final TourScheduleRepository repository;

    @Transactional
    public TourScheduleDTO create(TourScheduleDTO dto) {
        try {
            validateDates(dto);
            TourSchedule entity = mapToEntity(dto);
            TourSchedule saved = repository.save(entity);
            return mapToDTO(saved);
        } catch (Exception e) {
            logger.error("Error creating tour schedule", e);
            throw new RuntimeException("Failed to create tour schedule: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public TourScheduleDTO getById(Integer id) {
        try {
            TourSchedule entity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tour schedule not found with id: " + id));
            return mapToDTO(entity);
        } catch (Exception e) {
            logger.error("Error retrieving tour schedule with id: " + id, e);
            throw new RuntimeException("Failed to retrieve tour schedule: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<TourScheduleDTO> getByTourId(Integer tourId) {
        try {
            return repository.findByTourId(tourId)
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving tour schedules for tour id: " + tourId, e);
            throw new RuntimeException("Failed to retrieve tour schedules: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<TourScheduleDTO> getAll() {
        try {
            logger.info("Retrieving all tour schedules from repository");
            List<TourSchedule> entities = repository.findAll();
            logger.info("Found {} tour schedules", entities.size());
            return entities.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving all tour schedules", e);
            throw new RuntimeException("Failed to retrieve tour schedules: " + e.getMessage());
        }
    }

    @Transactional
    public TourScheduleDTO update(Integer id, TourScheduleDTO dto) {
        try {
            TourSchedule entity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tour schedule not found with id: " + id));
            validateDates(dto);
            mapToEntity(dto, entity);
            entity.setUpdatedAt(LocalDateTime.now());
            TourSchedule updated = repository.save(entity);
            return mapToDTO(updated);
        } catch (Exception e) {
            logger.error("Error updating tour schedule with id: " + id, e);
            throw new RuntimeException("Failed to update tour schedule: " + e.getMessage());
        }
    }

    @Transactional
    public void delete(Integer id) {
        try {
            if (!repository.existsById(id)) {
                throw new IllegalArgumentException("Tour schedule not found with id: " + id);
            }
            repository.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting tour schedule with id: " + id, e);
            throw new RuntimeException("Failed to delete tour schedule: " + e.getMessage());
        }
    }

    private void validateDates(TourScheduleDTO dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        if (dto.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }
    }

    private TourScheduleDTO mapToDTO(TourSchedule entity) {
        TourScheduleDTO dto = new TourScheduleDTO();
        dto.setScheduleId(entity.getScheduleId());
        dto.setTourId(entity.getTourId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStatus(entity.getStatus().getValue());
        return dto;
    }

    private TourSchedule mapToEntity(TourScheduleDTO dto) {
        TourSchedule entity = new TourSchedule();
        mapToEntity(dto, entity);
        return entity;
    }

    private void mapToEntity(TourScheduleDTO dto, TourSchedule entity) {
        entity.setTourId(dto.getTourId());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setStatus(TourSchedule.Status.fromString(dto.getStatus()));
    }
}