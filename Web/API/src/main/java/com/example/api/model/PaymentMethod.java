package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "payment_methods")
@Data
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "method_id")
    private Integer methodId;

    @Column(name = "method_name", nullable = false, unique = true)
    private String methodName;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active", columnDefinition = "bit(1) default 1")
    @ColumnDefault("1")
    private Boolean isActive;

    @Column(name = "created_at", columnDefinition = "datetime default current_timestamp")
    @ColumnDefault("current_timestamp")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isActive == null) {
            isActive = true;
        }
    }
} 