package com.example.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GuideReviewDTO {
    private Integer guideReviewId;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Guide ID is required")
    private Integer guideId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    private String comment;
    private LocalDateTime createdAt;
    
    // Additional fields for response
    private String userName;
    private String guideName;
    private String guideSpecialization;
    private String guideLanguages;
    private Double guideRating;
} 