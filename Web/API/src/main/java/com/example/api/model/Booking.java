package com.example.api.model;


import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private BookingStatus status;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "created_at", columnDefinition = "datetime default current_timestamp")
    @ColumnDefault("current_timestamp")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "datetime default current_timestamp on update current_timestamp")
    @ColumnDefault("current_timestamp")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

