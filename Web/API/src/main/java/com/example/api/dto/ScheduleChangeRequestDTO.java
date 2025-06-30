package com.example.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ScheduleChangeRequestDTO {
    private Integer requestId;
    
    @NotNull(message = "Schedule ID is required")
    private Integer scheduleId;
    
    @NotNull(message = "Guide ID is required")
    private Integer guideId;
    
    @NotNull(message = "Request type is required")
    private String requestType;
    
    private Integer currentItineraryId;
    
    @NotBlank(message = "Proposed changes are required")
    private String proposedChanges;
    
    @NotBlank(message = "Reason is required")
    private String reason;
    
    private String urgencyLevel = "medium";
    
    private String status = "pending";
    
    private String adminResponse;
    
    private Long adminId;
    
    private LocalDateTime requestedAt;
    
    private LocalDateTime respondedAt;
    
    private LocalDate effectiveDate;
    
    // Additional fields for display
    private String tourName;
    private String guideName;
    private String adminName;
    private LocalDate scheduleStartDate;
    private LocalDate scheduleEndDate;
} 