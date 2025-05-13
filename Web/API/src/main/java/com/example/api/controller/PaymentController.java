package com.example.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.api.dto.PaymentRequestDTO;
import com.example.api.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/momo-create")
    public ResponseEntity<?> createMomo(@RequestBody PaymentRequestDTO dto) {
        try {
            String payUrl = paymentService.createMomoPayment(dto);
            return ResponseEntity.ok(Map.of("payUrl", payUrl));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi tạo thanh toán MoMo: " + e.getMessage());
        }
    }

    @GetMapping("/momo-return")
    public ResponseEntity<String> momoReturn(HttpServletRequest request) {
        Map<String, String> params = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0]));
        paymentService.saveMomoPayment(params);
        return ResponseEntity.ok("Giao dịch MoMo đã xử lý!");
    }

    @PostMapping("/momo-notify")
    public ResponseEntity<String> momoNotify(HttpServletRequest request) {
        return ResponseEntity.ok("OK");
    }
}