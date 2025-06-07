package com.example.api.model;

import java.time.LocalDateTime;
import lombok.Data;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Table(name = "experiences")
@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Experience {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Long experienceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    @JsonIgnoreProperties({"tokens", "roles", "tourGuide", "hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Tour tour;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "status")
    private String status = "pending";

    // Remove explicit getters and setters since we're using @Data from Lombok
}
