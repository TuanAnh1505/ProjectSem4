package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_discounts")
@IdClass(UserDiscountId.class)
@Data
public class UserDiscount {
    @Id
    @Column(name = "tour_id")
    private Integer tourId;

    @Id
    @Column(name = "userid")
    private Long userid; // Changed from userId to userid to match IdClass

    @Id
    @Column(name = "discount_id")
    private Integer discountId;

    @Column(name = "used")
    private Boolean used;

    @ManyToOne
    @JoinColumn(name = "tour_id", insertable = false, updatable = false)
    private Tour tour;

    @ManyToOne
    @JoinColumn(name = "userid", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "discount_id", insertable = false, updatable = false)
    private Discount discount;
}
