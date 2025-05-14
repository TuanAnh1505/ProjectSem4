package com.example.api.repository;

import com.example.api.model.UserDiscount;
import com.example.api.model.UserDiscountId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDiscountRepository extends JpaRepository<UserDiscount, UserDiscountId> {
    boolean existsByUseridAndDiscountIdAndTourIdAndUsedTrue(Long userid, Integer discountId, Integer tourId);
}