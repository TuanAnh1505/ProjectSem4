package com.example.api.dto;

import lombok.Data;

@Data
public class CreateGuideRequestDTO {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Integer experienceYears;
    private String specialization;
    private String languages;
} 