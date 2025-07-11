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

  
    @GetMapping("/methods")
    public ResponseEntity<?> getPaymentMethods() {
        try {
            return ResponseEntity.ok(paymentService.getAllPaymentMethods());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


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

           
            List<PaymentResponseDTO> existingPayments = paymentService.getPaymentsByBooking(bookingId);

           
            boolean hasCompleted = existingPayments.stream()
                .anyMatch(p -> "Completed".equalsIgnoreCase(p.getStatusName()));
            if (hasCompleted) {
                return ResponseEntity.badRequest().body(Map.of("error", "Booking này đã thanh toán xong!"));
            }

           
            PaymentResponseDTO payment = existingPayments.stream()
                .filter(p -> !"Failed".equalsIgnoreCase(p.getStatusName()))
                .findFirst()
                .orElse(null);

            if (payment == null) {
                // Tạo payment record mới
                PaymentRequestDTO dto = new PaymentRequestDTO();
                dto.setBookingId(bookingId);
                dto.setUserId((long) userId);
                dto.setAmount(new java.math.BigDecimal(amount));
                dto.setPaymentMethodId(2); 
                payment = paymentService.createPayment(dto);
            }

            String qrDataURL = paymentService.generateVietQr("9021400417865", "Pham Van Tuan Anh", amount, phone);
            Map<String, Object> result = new HashMap<>();
            result.put("qrDataURL", qrDataURL);
            result.put("accountNumber", "9021400417865");
            result.put("accountName", "Pham Van Tuan Anh");
            result.put("bankName", "Timo BVBank");
            result.put("amount", amount);
            result.put("transferContent", phone);
            result.put("paymentId", payment.getPaymentId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
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

   
    @PutMapping("/{id}/request-refund")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> requestRefund(
            @PathVariable Integer id,
            @RequestParam(required = false) String notes,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        try {
            PaymentResponseDTO updated = paymentService.requestRefund(id, notes, userDetails.getUsername());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
    @PutMapping("/{id}/support-contact")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatusToSupportContact(@PathVariable Integer id) {
        try {
            var updated = paymentService.updatePaymentStatusToSupportContact(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/transaction/{transactionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPaymentByTransactionId(@PathVariable String transactionId) {
        try {
            PaymentResponseDTO payment = paymentService.getPaymentByTransactionId(transactionId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/code/{paymentCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPaymentByCode(@PathVariable String paymentCode) {
        try {
            PaymentResponseDTO payment = paymentService.getPaymentByCode(paymentCode);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}