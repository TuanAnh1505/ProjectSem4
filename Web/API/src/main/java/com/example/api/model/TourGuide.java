package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tour_guides")
@Data
public class TourGuide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guide_id", columnDefinition = "int(11)")
    private Long guideId;

    @Column(name = "userid", columnDefinition = "bigint(20)", unique = true, nullable = false)
    private Long userId;

    @Column(name = "experience_years", columnDefinition = "int(11)")
    private Integer experienceYears;

    @Column(name = "specialization", columnDefinition = "varchar(255)")
    private String specialization;

    @Column(name = "languages", columnDefinition = "varchar(255)")
    private String languages;

    @Column(name = "rating", columnDefinition = "decimal(3,1) default 0.0")
    @ColumnDefault("0.0")
    private Double rating;

    @Column(name = "is_available", columnDefinition = "tinyint(1) default 1")
    @ColumnDefault("1")
    private Boolean isAvailable = true;

    @Column(name = "created_at", columnDefinition = "datetime default current_timestamp")
    @ColumnDefault("current_timestamp")
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", insertable = false, updatable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (rating == null) {
            rating = 0.0;
        }
        if (isAvailable == null) {
            isAvailable = true;
        }
    }
}