package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_schedules")
@Data
public class TourSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "tour_id", nullable = false)
    private Integer tourId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(20)")
    private Status status = Status.available;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        available("available"),
        full("full"),
        cancelled("cancelled"),
        pending("pending"),
        completed("completed");

        private final String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static Status fromString(String text) {
            if (text == null) {
                return available;
            }
            for (Status status : Status.values()) {
                if (status.value.equalsIgnoreCase(text)) {
                    return status;
                }
            }
            return available;
        }
    }
}