package com.example.api.dto;

public class TourStatusDTO {
    private  Integer tourstatusid;
    private String statusname;

    public Integer getTourstatusid() {
        return tourstatusid;
    }

    public void setTourstatusid(Integer tourstatusid) {
        this.tourstatusid = tourstatusid;
    }

    public String getStatusname() {
        return statusname;
    }

    public void setStatusname(String statusname) {
        this.statusname = statusname;
    }
}
