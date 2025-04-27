package com.example.api.model;

import lombok.Data;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id")
    private Integer destinationId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @ElementCollection
    @CollectionTable(name = "destination_file_paths", joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "file_path")
    private List<String> filePaths;

    private String description;

    private String location;

    @Column(nullable = false)
    private Double rating;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Other fields, getters, and setters


}