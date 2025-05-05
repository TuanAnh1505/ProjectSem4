package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "event_status")
public class EventStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_status_id")
    private Integer eventStatusId;

    @Column(name = "status_name", nullable = false, unique = true)
    private String statusName;
}