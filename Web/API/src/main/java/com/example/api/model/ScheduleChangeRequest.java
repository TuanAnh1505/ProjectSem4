package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_change_requests")
@Data
public class ScheduleChangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @Column(name = "schedule_id", nullable = false)
    private Integer scheduleId;

    @Column(name = "guide_id", nullable = false)
    private Integer guideId;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private RequestType requestType;

    @Column(name = "current_itinerary_id")
    private Integer currentItineraryId;

    @Column(name = "proposed_changes", nullable = false, columnDefinition = "TEXT")
    private String proposedChanges;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false)
    private UrgencyLevel urgencyLevel = UrgencyLevel.medium;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.pending;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    @Column(name = "admin_id")
    private Long adminId;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    public enum RequestType {
        itinerary_change,
        schedule_change,
        emergency_change
    }

    public enum UrgencyLevel {
        low,
        medium,
        high,
        critical
    }

    public enum Status {
        pending,
        approved,
        rejected,
        cancelled
    }
} 