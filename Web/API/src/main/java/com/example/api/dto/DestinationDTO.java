package com.example.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DestinationDTO {
    private Integer destinationId;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @NotNull(message = "FileType is required")
    private String fileType;

    @Size(max = 65535, message = "Description must not exceed 65535 characters")
    private String description;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Float rating;
}
