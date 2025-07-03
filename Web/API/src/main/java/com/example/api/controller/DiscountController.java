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

    @PostMapping("/check")
    public ResponseEntity<?> checkDiscount(@RequestBody java.util.Map<String, Object> payload) {
        String code = (String) payload.get("code");
        
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Mã giảm giá không hợp lệ"));
        }
        var discountOpt = discountService.getDiscountByCode(code);
        if (discountOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Mã giảm giá không hợp lệ hoặc đã hết hạn"));
        }
        var discount = discountOpt.get();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (now.isBefore(discount.getStartDate()) || now.isAfter(discount.getEndDate())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Mã giảm giá đã hết hạn"));
        }
        if (!discountService.isDiscountAvailable(discount)) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Mã giảm giá đã hết số lượng"));
        }
        return ResponseEntity.ok(discount);
    }
}