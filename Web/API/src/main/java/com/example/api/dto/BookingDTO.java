package com.example.api.dto;

import java.math.BigDecimal;

public class BookingDTO {
    private Integer bookingId;
    private String userFullName;
    private String tourName;
    private String selectedDate;
    private String bookingDate;
    private String statusName;
    private BigDecimal totalPrice;

    public BookingDTO(Integer bookingId, String userFullName, String tourName, String selectedDate, String bookingDate, String statusName, BigDecimal totalPrice) {
        this.bookingId = bookingId;
        this.userFullName = userFullName;
        this.tourName = tourName;
        this.selectedDate = selectedDate;
        this.bookingDate = bookingDate;
        this.statusName = statusName;
        this.totalPrice = totalPrice;
    }

    // Getters và setters (có thể dùng Lombok @Data nếu muốn)
    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }
    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }
    public String getTourName() { return tourName; }
    public void setTourName(String tourName) { this.tourName = tourName; }
    public String getSelectedDate() { return selectedDate; }
    public void setSelectedDate(String selectedDate) { this.selectedDate = selectedDate; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}