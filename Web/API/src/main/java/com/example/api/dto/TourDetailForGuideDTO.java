package com.example.api.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TourDetailForGuideDTO {
    private Integer tourId;
    private String tourName;
    private String tourDescription;
    private String tourImage;
    private BigDecimal tourPrice;
    private Integer tourDuration;
    private String tourStatus;
    
    // Schedule information
    private Integer scheduleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String scheduleStatus;
    private Integer maxCapacity;
    private Integer currentBookings;
    
    // Itinerary information
    private List<TourItineraryDTO> itinerary;
    
    // Passenger information
    private List<PassengerDetailDTO> passengers;
    
    // Assignment information
    private Integer assignmentId;
    private String guideRole;
    private String assignmentStatus;
    private Integer guideId;
} 