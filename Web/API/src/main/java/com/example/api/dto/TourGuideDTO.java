package com.example.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TourGuideDTO {
    private Long guideId;

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @Min(value = 0, message = "Experience years must be greater than or equal to 0")
    private Integer experienceYears;

    @NotBlank(message = "Specialization cannot be blank")
    private String specialization;

    @NotBlank(message = "Languages cannot be blank")
    private String languages;

    @Min(value = 0, message = "Rating must be between 0 and 5")
    @Max(value = 5, message = "Rating must be between 0 and 5")
    private Double rating;

    private Boolean isAvailable = true;

    private LocalDateTime createdAt;

    private String userFullName;
    private String userEmail;
}
