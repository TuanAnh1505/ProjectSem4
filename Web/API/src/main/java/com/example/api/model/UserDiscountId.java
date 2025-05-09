package com.example.api.model;

import lombok.Data;
import java.io.Serializable;

@Data
public class UserDiscountId implements Serializable {
    private Integer tourId;
    private Long userid; // Must match the entity property name exactly
    private Integer discountId;
}