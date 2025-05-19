package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tour_status")
@Data
public class TourStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_status_id")
    private Integer tourStatusId;

    @Column(name = "status_name", unique = true)
    private String statusName;
}   