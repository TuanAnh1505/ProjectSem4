package com.example.api.model;

import lombok.Data;
import java.io.Serializable;

@Data
public class UserDiscountId implements Serializable {
    private Integer tourId;
    private Long userid;
    private Integer discountId;
}