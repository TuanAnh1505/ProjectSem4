package com.example.api.dto;

import java.math.BigDecimal;

public class BookingDTO {
    private Integer bookingId;
    private String bookingCode;
    private String userFullName;
    private String tourName;
    private String bookingDate;
    private String statusName;
    private BigDecimal totalPrice;
    private Integer scheduleId;
    

    public BookingDTO(Integer bookingId, String bookingCode, String userFullName, String tourName, String bookingDate, String statusName, BigDecimal totalPrice, Integer scheduleId) {
        this.bookingId = bookingId;
        this.bookingCode = bookingCode;
        this.userFullName = userFullName;
        this.tourName = tourName;
        this.bookingDate = bookingDate;
        this.statusName = statusName;
        this.totalPrice = totalPrice;
        this.scheduleId = scheduleId;
    }

    // Getters và setters (có thể dùng Lombok @Data nếu muốn)
    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }
    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }
    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }
    public String getTourName() { return tourName; }
    public void setTourName(String tourName) { this.tourName = tourName; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public Integer getScheduleId() { return scheduleId; }
    public void setScheduleId(Integer scheduleId) { this.scheduleId = scheduleId; }
}