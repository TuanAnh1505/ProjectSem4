package com.example.api.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingPassengerDTO {
    private Integer passengerId;
    private Integer bookingId;
    private Long userId;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private String passengerType;
    private String gender;
    private String birthDate;
}

