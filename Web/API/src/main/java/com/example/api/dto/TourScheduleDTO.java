package com.example.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TourScheduleDTO {
    private Integer scheduleId;

    @NotNull(message = "Tour ID is required")
    private Integer tourId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @NotNull(message = "Status is required")
    @Pattern(regexp = "^(available|full|cancelled|pending|completed)$", 
             message = "Status must be one of: available, full, cancelled, pending, completed")
    private String status;

    private int currentParticipants;
}
