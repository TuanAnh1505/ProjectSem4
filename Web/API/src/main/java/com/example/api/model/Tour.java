package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "tours")
@Data
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_id")
    private Integer tourId;

    private String name;
    private String description;
    private BigDecimal price;
    private Integer duration;

    @Column(name = "max_participants", columnDefinition = "INT DEFAULT 0")
    private Integer maxParticipants;

    @Column(name = "status_id")
    private Integer statusId;

    @Column(name = "image_url")
    private String imageUrl;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "tour_destinations",
        joinColumns = @JoinColumn(name = "tour_id"),
        inverseJoinColumns = @JoinColumn(name = "destination_id")
    )
    @JsonIgnoreProperties("tours")
    private List<Destination> destinations;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "tour_events",
        joinColumns = @JoinColumn(name = "tour_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    @JsonIgnoreProperties("tours")
    private List<Event> events;
}