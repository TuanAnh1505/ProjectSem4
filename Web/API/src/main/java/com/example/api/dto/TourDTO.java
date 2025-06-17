package com.example.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Data
public class TourDTO {
    private Integer tourId;

    @NotNull(message = "Name cannot be null")
    private String name;

    private String description;

    @NotNull(message = "Price cannot be null")
    private BigDecimal price;
    private Integer duration;
    private Integer maxParticipants;
    private Integer statusId;
    private List<String> imageUrls;

    private List<Integer> destinationIds;
    private List<Integer> eventIds;
}