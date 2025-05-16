package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tour_itinerary_events")
public class TourItineraryEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "itinerary_id")
    private Integer itineraryId;

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "attend_time") // Fix column name
    private LocalDateTime attendTime;

    private String note;

    // Getters & Setters
}
