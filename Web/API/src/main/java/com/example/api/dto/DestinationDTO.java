package com.example.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.util.List;

@Data
public class DestinationDTO {
    private Integer destinationId;

    @NotNull(message = "Name cannot be null")
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotNull(message = "Category cannot be null")
    @NotBlank(message = "Category cannot be blank")
    private String category;

    private List<String> filePaths; // Stores file paths (e.g., "/uploads/destinations/uuid_file.jpg")

    private String description;

    private String location;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 0, message = "Rating must be between 0 and 5")
    @Max(value = 5, message = "Rating must be between 0 and 5")
    private Double rating;
}