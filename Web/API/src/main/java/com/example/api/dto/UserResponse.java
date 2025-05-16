package com.example.api.dto;

import java.util.UUID;

public class UserResponse {
    // private Long userId;
    private UUID publicId;
    private String fullName;
    private String email;
    private String phone;
    private String address;

    // Constructor
    public UserResponse( UUID publicId, String fullName, String email, String phone, String address) {
        // this.userId = userId;
        this.publicId = publicId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    
    // Getters and Setters
    // public Long getUserId() {
    //     return userId;
    // }

    // public void setUserId(Long userId) {
    //     this.userId = userId;
    // }

    public UUID getPublicId() {
        return publicId;
    }

    public void setPublicId(UUID publicId) {
        this.publicId = publicId;
    }

    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
