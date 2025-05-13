package com.example.api.service;

import com.example.api.dto.TourItineraryDTO;
import com.example.api.model.Destination;
import com.example.api.model.Event;
import com.example.api.model.TourItinerary;
import com.example.api.model.TourItineraryDestination;
import com.example.api.model.TourItineraryEvent;
import com.example.api.repository.TourItineraryDestinationRepository;
import com.example.api.repository.TourItineraryEventRepository;
import com.example.api.repository.TourItineraryRepository;
import com.example.api.repository.DestinationRepository;
import com.example.api.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

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
    private EventRepository eventRepository; // Renamed from eventRepo to avoid duplicate field

    public TourItineraryDTO createItinerary(TourItineraryDTO dto) {
        TourItinerary itinerary = new TourItinerary();
        itinerary.setTourId(dto.getTourId());
        itinerary.setTitle(dto.getTitle());
        itinerary.setDescription(dto.getDescription());
        itinerary = itineraryRepo.save(itinerary);

        // Save destinations with details
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

        // Save events with details
        if (dto.getEvents() != null) {
            for (TourItineraryDTO.EventDetail event : dto.getEvents()) {
                TourItineraryEvent eventEntity = new TourItineraryEvent();
                eventEntity.setItineraryId(itinerary.getItineraryId());
                eventEntity.setEventId(event.getEventId());
                try {
                    eventEntity.setAttendTime(
                            event.getAttendTime() != null ? LocalDateTime.parse(event.getAttendTime()) : null);
                } catch (Exception e) {
                    // Handle date parse error
                    throw new RuntimeException("Invalid date format for event: " + event.getName());
                }
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
                eventEntity.setAttendTime(LocalDateTime.parse(event.getAttendTime()));
                eventEntity.setNote(event.getNote());
                eventRepo.save(eventEntity);
            }
        }

        return getItineraryDetail(itinerary.getItineraryId());
    }

    public List<TourItineraryDTO> getItinerariesByTourId(Integer tourId) {
        return itineraryRepo.findByTourId(tourId).stream().map(i -> {
            TourItineraryDTO dto = new TourItineraryDTO();
            dto.setItineraryId(i.getItineraryId());
            dto.setTourId(i.getTourId());
            dto.setTitle(i.getTitle());
            dto.setDescription(i.getDescription());

            // Load destination details for each itinerary
            List<TourItineraryDTO.DestinationDetail> destinations = destRepo.findByItineraryId(i.getItineraryId())
                    .stream()
                    .map(d -> {
                        TourItineraryDTO.DestinationDetail detail = new TourItineraryDTO.DestinationDetail();
                        detail.setDestinationId(d.getDestinationId());
                        detail.setVisitOrder(d.getVisitOrder());
                        detail.setNote(d.getNote());
                        return detail;
                    })
                    .collect(Collectors.toList());
            dto.setDestinations(destinations);

            // Load event details for each itinerary
            List<TourItineraryDTO.EventDetail> events = eventRepo.findByItineraryId(i.getItineraryId())
                    .stream()
                    .map(e -> {
                        TourItineraryDTO.EventDetail detail = new TourItineraryDTO.EventDetail();
                        detail.setEventId(e.getEventId());
                        detail.setAttendTime(e.getAttendTime() != null ? e.getAttendTime().toString() : null);
                        detail.setNote(e.getNote());
                        return detail;
                    })
                    .collect(Collectors.toList());
            dto.setEvents(events);

            return dto;
        }).collect(Collectors.toList());
    }

    public TourItineraryDTO getItineraryDetail(Integer itineraryId) {
        TourItinerary i = itineraryRepo.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        TourItineraryDTO dto = new TourItineraryDTO();
        dto.setItineraryId(i.getItineraryId());
        dto.setTourId(i.getTourId());
        dto.setTitle(i.getTitle());
        dto.setDescription(i.getDescription());

        // Load destination details
        List<TourItineraryDTO.DestinationDetail> destinations = destRepo.findByItineraryId(itineraryId)
                .stream()
                .map(d -> {
                    TourItineraryDTO.DestinationDetail detail = new TourItineraryDTO.DestinationDetail();
                    detail.setDestinationId(d.getDestinationId());
                    detail.setVisitOrder(d.getVisitOrder());
                    detail.setNote(d.getNote());
                    return detail;
                })
                .collect(Collectors.toList());
        dto.setDestinations(destinations);

        // Load event details
        List<TourItineraryDTO.EventDetail> events = eventRepo.findByItineraryId(itineraryId)
                .stream()
                .map(e -> {
                    TourItineraryDTO.EventDetail detail = new TourItineraryDTO.EventDetail();
                    detail.setEventId(e.getEventId());
                    detail.setAttendTime(e.getAttendTime().toString());
                    detail.setNote(e.getNote());
                    return detail;
                })
                .collect(Collectors.toList());
        dto.setEvents(events);

        return dto;
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

    public List<TourItineraryDTO> getAllItineraries() {
        return itineraryRepo.findAll().stream()
                .map(i -> {
                    TourItineraryDTO dto = new TourItineraryDTO();
                    dto.setItineraryId(i.getItineraryId());
                    dto.setTourId(i.getTourId());
                    dto.setTitle(i.getTitle());
                    dto.setDescription(i.getDescription());

                    // Load destination details
                    List<TourItineraryDTO.DestinationDetail> destinations = destRepo
                            .findByItineraryId(i.getItineraryId())
                            .stream()
                            .map(d -> {
                                TourItineraryDTO.DestinationDetail detail = new TourItineraryDTO.DestinationDetail();
                                detail.setDestinationId(d.getDestinationId());
                                detail.setVisitOrder(d.getVisitOrder());
                                detail.setNote(d.getNote());
                                return detail;
                            })
                            .collect(Collectors.toList());
                    dto.setDestinations(destinations);

                    // Load event details
                    List<TourItineraryDTO.EventDetail> events = eventRepo.findByItineraryId(i.getItineraryId())
                            .stream()
                            .map(e -> {
                                TourItineraryDTO.EventDetail detail = new TourItineraryDTO.EventDetail();
                                detail.setEventId(e.getEventId());
                                detail.setAttendTime(e.getAttendTime() != null ? e.getAttendTime().toString() : null);
                                detail.setNote(e.getNote());
                                return detail;
                            })
                            .collect(Collectors.toList());
                    dto.setEvents(events);

                    return dto;
                })
                .collect(Collectors.toList());
    }
}
