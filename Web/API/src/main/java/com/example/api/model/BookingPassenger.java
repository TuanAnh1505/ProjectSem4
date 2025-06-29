package com.example.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Table(name = "booking_passengers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingPassenger {
    private static final Logger log = LoggerFactory.getLogger(BookingPassenger.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Integer passengerId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    private String phone;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    private PassengerType passengerType;

    @Column(name = "gender")
    private String gender;

    @Column(name = "birth_date")
    private String birthDate;

    @ManyToOne
    @JoinColumn(name = "guardian_passenger_id")
    private BookingPassenger guardianPassenger;

    public enum PassengerType {
        adult, child, infant
    }

    @PrePersist
    @PreUpdate
    public void logBeforeSave() {
        log.info("Saving passenger: gender={}, birthDate={}", gender, birthDate);
    }
}
