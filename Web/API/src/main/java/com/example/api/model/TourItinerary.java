package com.example.api.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tour_itineraries")
public class TourItinerary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "itinerary_id")
    private Integer itineraryId;

    @Column(name = "tour_id")
    private Integer tourId;

    private String title;

    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();



    // Getters & Setters
}
