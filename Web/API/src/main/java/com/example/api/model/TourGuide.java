package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tour_guides")
@Data
public class TourGuide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guide_id")
    private Long guideId;

    @Column(name = "userid",unique = true,nullable = false)
    private Long userId;

    @Column(name="experience_years")
    private Integer experienceYears;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "languages")
    private String languages;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "userid", insertable = false, updatable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "tour_guides_assignments",
            joinColumns = @JoinColumn(name = "guide_id"),
            inverseJoinColumns = @JoinColumn(name = "tour_id")
    )
    private List<Tour> tours = new ArrayList<>();

    @OneToMany(mappedBy = "tourGuide", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuideReview> reviews = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (rating == null) {
            rating = 0.0;
        }
    }

}