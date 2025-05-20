package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tour_guide_assignments")
public class TourGuideAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @Column(name = "tour_id", nullable = false)
    private Integer tourId;

    @Column(name = "guide_id", nullable = false)
    private Integer guideId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private GuideRole role;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AssignmentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", insertable = false, updatable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", insertable = false, updatable = false)
    private TourGuide guide;

    public enum GuideRole {
        main_guide,
        assistant_guide,
        specialist
    }

    public enum AssignmentStatus {
        assigned,
        completed,
        cancelled
    }
} 