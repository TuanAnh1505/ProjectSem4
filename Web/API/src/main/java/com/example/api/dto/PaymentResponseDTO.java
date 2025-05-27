package com.example.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PaymentResponseDTO {
    private Integer paymentId;
    private Integer bookingId;
    private Long userId;
    private BigDecimal amount;
    private Integer paymentMethodId;
    private String paymentMethod;
    private Integer statusId;
    private String statusName;
    private String transactionId;
    private LocalDateTime paymentDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 