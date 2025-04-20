package com.example.api.dto;

import java.math.BigDecimal;

public class TourDTO {
    private Integer tourid;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Integer maxparticipants;
    private Integer destinationid;
    private Integer statusid;

    public Integer getTourid() {
        return tourid;
    }

    public void setTourid(Integer tourid) {
        this.tourid = tourid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getMaxparticipants() {
        return maxparticipants;
    }

    public void setMaxparticipants(Integer maxparticipants) {
        this.maxparticipants = maxparticipants;
    }

    public Integer getDestinationid() {
        return destinationid;
    }

    public void setDestinationid(Integer destinationid) {
        this.destinationid = destinationid;
    }

    public Integer getStatusid() {
        return statusid;
    }

    public void setStatusid(Integer statusid) {
        this.statusid = statusid;
    }
}
