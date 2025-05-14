package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tour_guides_assignments")
@IdClass(TourGuideAssignment.TourGuideAssignmentId.class)
public class TourGuideAssignment {
    @Id
    @Column(name = "tour_id", columnDefinition = "int(11)")
    private Integer tourId;

    @Id
    @Column(name = "guide_id", columnDefinition = "int(11)")
    private Integer guideId;

    @Column(name = "created_at", columnDefinition = "datetime default current_timestamp")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", insertable = false, updatable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", insertable = false, updatable = false)
    private TourGuide guide;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Data
    public static class TourGuideAssignmentId implements java.io.Serializable {
        private Integer tourId;
        private Integer guideId;
    }
} 