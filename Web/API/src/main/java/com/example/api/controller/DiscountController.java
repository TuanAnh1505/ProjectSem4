package com.example.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.api.service.DiscountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    @PostMapping("/send")
    public ResponseEntity<String> sendDiscountToUser(
            @RequestParam Long userId,
            @RequestParam Integer discountId) {
        discountService.sendDiscountCodeToUser(userId, discountId);
        return ResponseEntity.ok("Mã giảm giá đã được gửi thành công.");
    }
}