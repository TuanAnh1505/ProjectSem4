
package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tour_status")
@Data
public class TourStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_status_id")
    private Integer tourStatusId;

    @Column(name = "status_name", nullable = false, unique = true)
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
