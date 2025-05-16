package com.example.api.service;

import com.example.api.dto.TourItineraryDTO;
import com.example.api.model.*;
import com.example.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourItineraryService {

    @Autowired
    private TourItineraryRepository itineraryRepo;
    @Autowired
    private TourItineraryDestinationRepository destRepo;
    @Autowired
    private TourItineraryEventRepository eventRepo;
    @Autowired
    private DestinationRepository destinationRepo;
    @Autowired
    private EventRepository eventRepository;

    public TourItineraryDTO createItinerary(TourItineraryDTO dto) {
        TourItinerary itinerary = new TourItinerary();
        itinerary.setTourId(dto.getTourId());
        itinerary.setTitle(dto.getTitle());
        itinerary.setDescription(dto.getDescription());

        itinerary.setStartDate(dto.getStartDate());
        itinerary.setEndDate(dto.getEndDate());

        itinerary = itineraryRepo.save(itinerary);

        // Save destinations
        if (dto.getDestinations() != null) {
            for (TourItineraryDTO.DestinationDetail dest : dto.getDestinations()) {
                TourItineraryDestination destEntity = new TourItineraryDestination();
                destEntity.setItineraryId(itinerary.getItineraryId());
                destEntity.setDestinationId(dest.getDestinationId());
                destEntity.setVisitOrder(dest.getVisitOrder());
                destEntity.setNote(dest.getNote());
                destRepo.save(destEntity);
            }
        }

        // Save events
        if (dto.getEvents() != null) {
            for (TourItineraryDTO.EventDetail event : dto.getEvents()) {
                TourItineraryEvent eventEntity = new TourItineraryEvent();
                eventEntity.setItineraryId(itinerary.getItineraryId());
                eventEntity.setEventId(event.getEventId());
                eventEntity.setAttendTime(event.getAttendTime());
                eventEntity.setNote(event.getNote());
                eventRepo.save(eventEntity);
            }
        }

        return getItineraryDetail(itinerary.getItineraryId());
    }

    public TourItineraryDTO updateItinerary(TourItineraryDTO dto) {
        TourItinerary itinerary = itineraryRepo.findById(dto.getItineraryId())
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        itinerary.setTitle(dto.getTitle());
        itinerary.setDescription(dto.getDescription());
        itinerary.setStartDate(dto.getStartDate());
        itinerary.setEndDate(dto.getEndDate());
        itineraryRepo.save(itinerary);

        // Update destinations
        destRepo.deleteAll(destRepo.findByItineraryId(itinerary.getItineraryId()));
        if (dto.getDestinations() != null) {
            for (TourItineraryDTO.DestinationDetail dest : dto.getDestinations()) {
                TourItineraryDestination destEntity = new TourItineraryDestination();
                destEntity.setItineraryId(itinerary.getItineraryId());
                destEntity.setDestinationId(dest.getDestinationId());
                destEntity.setVisitOrder(dest.getVisitOrder());
                destEntity.setNote(dest.getNote());
                destRepo.save(destEntity);
            }
        }

        // Update events
        eventRepo.deleteAll(eventRepo.findByItineraryId(itinerary.getItineraryId()));
        if (dto.getEvents() != null) {
            for (TourItineraryDTO.EventDetail event : dto.getEvents()) {
                TourItineraryEvent eventEntity = new TourItineraryEvent();
                eventEntity.setItineraryId(itinerary.getItineraryId());
                eventEntity.setEventId(event.getEventId());
                eventEntity.setAttendTime(event.getAttendTime());
                eventEntity.setNote(event.getNote());
                eventRepo.save(eventEntity);
            }
        }

        return getItineraryDetail(itinerary.getItineraryId());
    }

    public TourItineraryDTO getItineraryDetail(Integer itineraryId) {
        TourItinerary i = itineraryRepo.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        TourItineraryDTO dto = new TourItineraryDTO();
        dto.setItineraryId(i.getItineraryId());
        dto.setTourId(i.getTourId());
        dto.setTitle(i.getTitle());
        dto.setDescription(i.getDescription());
        dto.setStartDate(i.getStartDate());
        dto.setEndDate(i.getEndDate());

        // Load destinations
        List<TourItineraryDTO.DestinationDetail> destinations = destRepo.findByItineraryId(itineraryId)
                .stream()
                .map(d -> {
                    TourItineraryDTO.DestinationDetail detail = new TourItineraryDTO.DestinationDetail();
                    detail.setDestinationId(d.getDestinationId());
                    detail.setVisitOrder(d.getVisitOrder());
                    detail.setNote(d.getNote());

                    // Optional: fetch destination name for display
                    destinationRepo.findById(d.getDestinationId()).ifPresent(dest -> detail.setName(dest.getName()));

                    return detail;
                })
                .collect(Collectors.toList());
        dto.setDestinations(destinations);

        // Load events
        List<TourItineraryDTO.EventDetail> events = eventRepo.findByItineraryId(itineraryId)
                .stream()
                .map(e -> {
                    TourItineraryDTO.EventDetail detail = new TourItineraryDTO.EventDetail();
                    detail.setEventId(e.getEventId());
                    detail.setAttendTime(e.getAttendTime());
                    detail.setNote(e.getNote());

                    // Optional: fetch event name for display
                    eventRepository.findById(e.getEventId()).ifPresent(ev -> detail.setName(ev.getName()));

                    return detail;
                })
                .collect(Collectors.toList());
        dto.setEvents(events);

        return dto;
    }

    public List<TourItineraryDTO> getItinerariesByTourId(Integer tourId) {
        return itineraryRepo.findByTourId(tourId).stream()
                .map(i -> getItineraryDetail(i.getItineraryId()))
                .collect(Collectors.toList());
    }

    public List<TourItineraryDTO> getAllItineraries() {
        return itineraryRepo.findAll().stream()
                .map(i -> getItineraryDetail(i.getItineraryId()))
                .collect(Collectors.toList());
    }

    public void deleteItinerary(Integer itineraryId) {
        destRepo.deleteAll(destRepo.findByItineraryId(itineraryId));
        eventRepo.deleteAll(eventRepo.findByItineraryId(itineraryId));
        itineraryRepo.deleteById(itineraryId);
    }

    public List<Destination> getTourDestinations(Integer tourId) {
        return destinationRepo.findByTourId(tourId);
    }

    public List<Event> getTourEvents(Integer tourId) {
        return eventRepository.findByTourId(tourId);
    }
}
