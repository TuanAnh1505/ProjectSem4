package com.example.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventDTO {
    private Integer eventId;

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String description;

    private String location;

    @NotNull(message = "Start date is mandatory")
    private LocalDateTime startDate;

    @NotNull(message = "End date is mandatory")
    private LocalDateTime endDate;

    private BigDecimal ticketPrice;

    @NotBlank(message = "Status name is mandatory")
    private String statusName;

    private LocalDateTime createdAt;

    private List<String> filePaths;
}