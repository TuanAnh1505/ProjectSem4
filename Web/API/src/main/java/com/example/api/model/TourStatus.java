package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="tour_status")
public class TourStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tourstatusid;

    @Column(name = "statusname", nullable = false , unique = true,length = 100)
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
