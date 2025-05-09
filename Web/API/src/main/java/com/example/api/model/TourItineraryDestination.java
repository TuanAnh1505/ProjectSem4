package com.example.api.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tour_itinerary_destinations")
public class TourItineraryDestination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "itinerary_id")
    private Integer itineraryId;

    @Column(name = "destination_id")
    private Integer destinationId;

    @Column(name = "visit_order")
    private Integer visitOrder;
    
    private String note;

    // Getters & Setters
}
