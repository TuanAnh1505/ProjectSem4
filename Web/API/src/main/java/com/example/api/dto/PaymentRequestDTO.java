package com.example.api.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Integer bookingId;
    private Long userId;
    private BigDecimal amount;
}


