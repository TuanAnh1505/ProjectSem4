package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "tours")
@Data
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_id")
    private Integer tourId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Column(name = "status_id", nullable = false)
    private Integer statusId;

    @ElementCollection
    @CollectionTable(name = "tour_image_urls", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @Column(name = "created_at", columnDefinition = "datetime default current_timestamp")
    @ColumnDefault("current_timestamp")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "datetime default current_timestamp on update current_timestamp")
    @ColumnDefault("current_timestamp")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "tour_destinations",
        joinColumns = @JoinColumn(name = "tour_id"),
        inverseJoinColumns = @JoinColumn(name = "destination_id")
    )
    @JsonIgnoreProperties("tours")
    private List<Destination> destinations = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "tour_events",
        joinColumns = @JoinColumn(name = "tour_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    @JsonIgnoreProperties("tours")
    private List<Event> events = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}