package com.example.api.service;


import com.example.api.dto.EventDTO;
import com.example.api.model.Event;
import com.example.api.model.EventStatus;
import com.example.api.repository.EventRepository;
import com.example.api.repository.EventStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventStatusRepository eventStatusRepository;

  
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = new Event();
        mapToEntity(eventDTO, event);
        Event savedEvent = eventRepository.save(event);
        return mapToDTO(savedEvent);
    }

  
    public EventDTO updateEvent(Integer eventId, EventDTO eventDTO) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        mapToEntity(eventDTO, event);
        Event updatedEvent = eventRepository.save(event);
        return mapToDTO(updatedEvent);
    }

 
    public void deleteEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        // Xóa file vật lý
        if (event.getFilePaths() != null) {
            event.getFilePaths().forEach(filePath -> {
                try {
                    Files.deleteIfExists(Paths.get(filePath));
                } catch (IOException e) {
                    throw new RuntimeException("Failed to delete file: " + filePath, e);
                }
            });
        }
        eventRepository.deleteById(eventId);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    public EventDTO getEventById(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToDTO(event);
    }


    private void mapToEntity(EventDTO eventDTO, Event event) {
        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setLocation(eventDTO.getLocation());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setTicketPrice(eventDTO.getTicketPrice());
        event.setFilePaths(eventDTO.getFilePaths());
        EventStatus status = eventStatusRepository.findByStatusName(eventDTO.getStatusName());
        if (status == null) {
            throw new RuntimeException("Status not found: " + eventDTO.getStatusName());
        }
        event.setStatus(status);
    }

  
    private EventDTO mapToDTO(Event event) {
        EventDTO eventDTO = new EventDTO();
        eventDTO.setEventId(event.getEventId());
        eventDTO.setName(event.getName());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setLocation(event.getLocation());
        eventDTO.setStartDate(event.getStartDate());
        eventDTO.setEndDate(event.getEndDate());
        eventDTO.setTicketPrice(event.getTicketPrice());
        eventDTO.setStatusName(event.getStatus() != null ? event.getStatus().getStatusName() : null);
        eventDTO.setCreatedAt(event.getCreatedAt());
        eventDTO.setFilePaths(event.getFilePaths());
        return eventDTO;
    }
}