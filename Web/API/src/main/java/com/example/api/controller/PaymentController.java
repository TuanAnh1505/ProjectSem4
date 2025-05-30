package com.example.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.api.dto.PaymentRequestDTO;
import com.example.api.dto.PaymentResponseDTO;
import com.example.api.dto.PaymentHistoryDTO;
import com.example.api.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create payment for any method
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        try {
            PaymentResponseDTO response = paymentService.createPayment(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get payment by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPayment(@PathVariable Integer id) {
        try {
            PaymentResponseDTO payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get payments by booking ID
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPaymentsByBooking(@PathVariable Integer bookingId) {
        try {
            List<PaymentResponseDTO> payments = paymentService.getPaymentsByBooking(bookingId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get payment history
    @GetMapping("/{id}/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPaymentHistory(@PathVariable Integer id) {
        try {
            List<PaymentHistoryDTO> history = paymentService.getPaymentHistory(id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update payment status (admin only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Integer id,
            @RequestParam Integer statusId,
            @RequestParam(required = false) String notes) {
        try {
            PaymentResponseDTO updated = paymentService.updatePaymentStatus(id, statusId, notes);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // MoMo specific endpoints
    @PostMapping("/momo/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createMomoPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        try {
            String payUrl = paymentService.createMomoPayment(dto);
            return ResponseEntity.ok(Map.of("payUrl", payUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/momo/return")
    public ResponseEntity<?> momoReturn(HttpServletRequest request) {
        try {
            Map<String, String> params = request.getParameterMap().entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0]));
            PaymentResponseDTO payment = paymentService.handleMomoReturn(params);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/momo/notify")
    public ResponseEntity<?> momoNotify(HttpServletRequest request) {
        try {
            Map<String, String> params = request.getParameterMap().entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0]));
            paymentService.handleMomoNotify(params);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all payment methods
    @GetMapping("/methods")
    public ResponseEntity<?> getPaymentMethods() {
        try {
            return ResponseEntity.ok(paymentService.getAllPaymentMethods());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all payment statuses
    @GetMapping("/statuses")
    public ResponseEntity<?> getPaymentStatuses() {
        try {
            return ResponseEntity.ok(paymentService.getAllPaymentStatuses());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/bank-transfer-qr")
    public ResponseEntity<?> generateBankTransferQr(@RequestBody Map<String, Object> payload) {
        try {
            int amount = (int) payload.get("amount");
            String phone = (String) payload.get("phone");
            int bookingId = (int) payload.getOrDefault("bookingId", 0);
            int userId = (int) payload.getOrDefault("userId", 0);
            // Tạo payment record
            PaymentRequestDTO dto = new PaymentRequestDTO();
            dto.setBookingId(bookingId);
            dto.setUserId((long) userId);
            dto.setAmount(new java.math.BigDecimal(amount));
            dto.setPaymentMethodId(2); // Bank Transfer
            PaymentResponseDTO payment = paymentService.createPayment(dto);
            // Gọi service để sinh QR
            String qrDataURL = paymentService.generateVietQr("9021400417865", "Pham Van Tuan Anh", amount, phone);
            System.out.println("VietQR generated qrDataURL: " + qrDataURL);
            Map<String, Object> result = new HashMap<>();
            result.put("qrDataURL", qrDataURL);
            result.put("accountNumber", "9021400417865");
            result.put("accountName", "Pham Van Tuan Anh");
            result.put("bankName", "Timo BVBank");
            result.put("amount", amount);
            result.put("transferContent", phone);
            result.put("paymentId", payment.getPaymentId());
            System.out.println("Sending response to frontend: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error generating QR code: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Integer id) {
        try {
            PaymentResponseDTO payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(Map.of(
                "statusId", payment.getStatusId(),
                "statusName", payment.getStatusName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPayments() {
        try {
            List<PaymentResponseDTO> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}