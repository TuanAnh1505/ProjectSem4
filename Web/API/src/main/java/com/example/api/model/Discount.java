package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
@Data
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer discountId;

    private String code;
    private String description;

    @Column(name = "discount_percent")
    private Float discountPercent;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

