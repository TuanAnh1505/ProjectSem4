package com.example.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerDetailDTO {
    private String fullName;
    private String gender;
    private String birthDate;
    private String passengerType;
}


