package com.example.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class TourStatusDTO {
    private Integer tourStatusId;

    @NotNull(message = "Status name cannot be null")
    @NotBlank(message = "Status name cannot be blank")
    private String statusName;

    public Integer getTourStatusId() {
        return tourStatusId;
    }

    public void setTourStatusId(Integer tourStatusId) {
        this.tourStatusId = tourStatusId;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }
}