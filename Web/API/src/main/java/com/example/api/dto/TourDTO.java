package com.example.api.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class TourDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Integer maxParticipants;
    private Integer statusId;
    private String imageUrl;

    private List<Integer> destinationIds;
    private List<Integer> eventIds;
}