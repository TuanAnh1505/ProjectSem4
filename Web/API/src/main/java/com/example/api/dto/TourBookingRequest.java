package com.example.api.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TourBookingRequest {
    private Long userId;
    private Integer tourId;
    private Integer scheduleId;
    private String discountCode;
    private LocalDate selectedDate;
}