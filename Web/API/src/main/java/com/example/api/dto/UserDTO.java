package com.example.api.dto;

import java.time.LocalDateTime;

public class UserDTO {
    private Long userid;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private boolean isActive;
    private LocalDateTime createdAt;

    public UserDTO(Long userid, String fullName, String email, String phone, String address, boolean isActive,
            LocalDateTime createdAt) {
        this.userid = userid;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
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

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
