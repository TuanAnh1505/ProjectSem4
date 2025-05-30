package com.example.api.dto;

import java.math.BigDecimal;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class PaymentRequestDTO {
    @NotNull(message = "Booking ID is required")
    private Integer bookingId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Payment method ID is required")
    private Integer paymentMethodId;
}


