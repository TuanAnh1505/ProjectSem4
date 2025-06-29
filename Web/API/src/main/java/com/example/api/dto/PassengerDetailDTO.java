package com.example.api.dto;

import lombok.Data;

@Data
public class PassengerDetailDTO {
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private String birthDate;
    private String passengerType;
    private Integer guardianPassengerId;
}


