package com.example.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer destinationId;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "FileType is required")
    @Enumerated(EnumType.STRING)
    private FileType fileType;

    @Size(max = 65535, message = "Description must not exceed 65535 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 5, message = "Rating must not exceed 5")
    @Column(columnDefinition = "FLOAT DEFAULT 0")
    private Float rating;

    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum FileType {
        Image, Video
    }
}
