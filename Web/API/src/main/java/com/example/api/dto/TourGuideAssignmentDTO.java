package com.example.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TourGuideAssignmentDTO {
    @NotNull(message = "Tour ID cannot be null")
    private Integer tourId;

    @NotNull(message = "Guide ID cannot be null")
    private Integer guideId;

    private LocalDateTime createdAt;

    // Additional fields for response
    private String tourName;
    private String guideName;
    private String tourDescription;
    private String guideSpecialization;
    private String guideLanguages;
    private Double guideRating;
} 