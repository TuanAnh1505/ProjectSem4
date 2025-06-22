package com.example.api.dto;

import com.example.api.model.TourGuideAssignment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TourGuideAssignmentDTO {
    private Integer assignmentId;

    @NotNull(message = "Tour ID cannot be null")
    private Integer tourId;

    @NotNull(message = "Guide ID cannot be null")
    private Integer guideId;

    @NotNull(message = "Schedule ID cannot be null")
    private Integer scheduleId;

    @NotNull(message = "Role cannot be null")
    private TourGuideAssignment.GuideRole role;

    @NotNull(message = "Start date cannot be null")
    private LocalDate startDate;

    @NotNull(message = "End date cannot be null")
    private LocalDate endDate;

    @NotNull(message = "Status cannot be null")
    private TourGuideAssignment.AssignmentStatus status;

    // Additional fields for response
    private String tourName;
    private String guideName;
    private String tourDescription;
    private String guideSpecialization;
    private String guideLanguages;
    private Double guideRating;
} 