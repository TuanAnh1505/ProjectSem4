package com.example.api.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PaymentHistoryDTO {
    private Integer historyId;
    private Integer paymentId;
    private Integer statusId;
    private String statusName;
    private LocalDateTime createdAt;
} 