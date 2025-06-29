package com.example.api.service;

import com.example.api.dto.PaymentRequestDTO;
import com.example.api.dto.PaymentResponseDTO;
import com.example.api.dto.PaymentHistoryDTO;
import com.example.api.model.*;
import com.example.api.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentStatusRepository paymentStatusRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingPassengerRepository bookingPassengerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TourScheduleService tourScheduleService;

    @Autowired
    private BookingStatusRepository bookingStatusRepository;

    @Autowired
    private UserDiscountRepository userDiscountRepository;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private DiscountRepository discountRepository;

    private static final String PARTNER_CODE = "VNPAY";
    private static final String SECRET_KEY = "VNPAY_SECRET_KEY";
    private static final String VNPAY_ENDPOINT = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private static final String RETURN_URL = "http://localhost:8080/api/payments/vnpay/return";
    private static final String NOTIFY_URL = "http://localhost:8080/api/payments/vnpay/notify";

    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {
        // Validate booking and user
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create payment record
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUser(user);
        payment.setAmount(dto.getAmount());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());

        // Set initial status (pending)
        PaymentStatus pendingStatus = paymentStatusRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Payment status not found"));
        payment.setStatus(pendingStatus);

        // Set payment method
        PaymentMethod method = paymentMethodRepository.findById(dto.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        payment.setPaymentMethod(method);

        // Save payment
        payment = paymentRepository.save(payment);

        // Create initial history record
        PaymentHistory history = new PaymentHistory();
        history.setPayment(payment);
        history.setStatus(pendingStatus);
        history.setNotes("Payment created");
        paymentHistoryRepository.save(history);

        return convertToDTO(payment);
    }

    public PaymentResponseDTO getPaymentById(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDTO(payment);
    }

    public List<PaymentResponseDTO> getPaymentsByBooking(Integer bookingId) {
        return paymentRepository.findByBooking_BookingId(bookingId).stream()
                .<PaymentResponseDTO>map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentHistoryDTO> getPaymentHistory(Integer paymentId) {
        return paymentHistoryRepository.findByPayment_PaymentId(paymentId).stream()
                .map(this::convertToHistoryDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponseDTO updatePaymentStatus(Integer paymentId, Integer statusId, String notes) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        PaymentStatus newStatus = paymentStatusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Payment status not found"));

        // Chỉ gửi email nếu trạng thái trước đó chưa phải Completed và trạng thái mới là Completed
        boolean wasCompleted = "Completed".equalsIgnoreCase(payment.getStatus().getStatusName());
        payment.setStatus(newStatus);
        payment = paymentRepository.save(payment);

        // Nếu thanh toán thành công (status_id = 3), cập nhật trạng thái booking sang CONFIRMED
        if (!wasCompleted && newStatus.getPaymentStatusId() == 3) { // 3 = Completed
            Booking booking = bookingRepository.findById(payment.getBooking().getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            BookingStatus confirmedStatus = bookingStatusRepository.findByStatusName("CONFIRMED")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái CONFIRMED"));
            booking.setStatus(confirmedStatus);
            bookingRepository.save(booking);

            // Đánh dấu mã giảm giá đã sử dụng nếu có
            if (booking.getDiscountId() != null) {
                UserDiscount ud = new UserDiscount();
                ud.setUserid(booking.getUser().getUserid());
                ud.setTourId(booking.getTour().getTourId());
                ud.setDiscountId(booking.getDiscountId());
                ud.setUsed(true);
                userDiscountRepository.save(ud);

                // Cập nhật used_quantity cho discount
                Discount discount = discountRepository.findById(booking.getDiscountId()).orElse(null);
                if (discount != null) {
                    discountService.checkAndUpdateDiscountQuantity(discount);
                }
            }

            try {
                User user = userRepository.findById(payment.getUser().getUserid())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(booking.getBookingId());
                emailService.sendPaymentSuccessEmail(user, booking, payment, passengers);

                // Gửi thông báo cho admin
                java.util.List<User> admins = userRepository.findAdmins();
                String subject = "[TravelTour] Có thanh toán mới cho tour: " + booking.getTour().getName();
                String content = String.format(
                    """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Thông báo thanh toán mới</title>
                        <style>
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                background-color: #f4f6f8;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 12px;
                                overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%);
                                color: white;
                                padding: 30px;
                                text-align: center;
                            }
                            .header h1 {
                                font-size: 24px;
                                font-weight: 600;
                                margin-bottom: 10px;
                            }
                            .header .icon {
                                font-size: 48px;
                                margin-bottom: 15px;
                            }
                            .content {
                                padding: 30px;
                            }
                            .notification-title {
                                font-size: 20px;
                                color: #28a745;
                                margin-bottom: 25px;
                                font-weight: 600;
                                text-align: center;
                            }
                            .info-grid {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 20px;
                                margin-bottom: 25px;
                            }
                            .info-item {
                                background-color: #f8f9fa;
                                padding: 15px;
                                border-radius: 8px;
                                border-left: 4px solid #28a745;
                            }
                            .info-item h3 {
                                color: #28a745;
                                font-size: 14px;
                                margin-bottom: 8px;
                                font-weight: 600;
                            }
                            .info-item p {
                                color: #333;
                                font-size: 16px;
                                font-weight: 500;
                                margin: 0;
                            }
                            .payment-details {
                                background: linear-gradient(135deg, #e8f5e8 0%%, #f0f8f0 100%%);
                                padding: 20px;
                                border-radius: 10px;
                                margin: 25px 0;
                                border: 2px solid #28a745;
                            }
                            .payment-details h2 {
                                color: #28a745;
                                font-size: 18px;
                                margin-bottom: 15px;
                                text-align: center;
                            }
                            .payment-row {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 10px 0;
                                border-bottom: 1px solid #e0e0e0;
                            }
                            .payment-row:last-child {
                                border-bottom: none;
                                font-weight: 600;
                                font-size: 18px;
                                color: #28a745;
                            }
                            .payment-label {
                                font-weight: 500;
                                color: #555;
                            }
                            .payment-value {
                                font-weight: 600;
                                color: #333;
                            }
                            .footer {
                                background-color: #f8f9fa;
                                padding: 25px;
                                text-align: center;
                                border-top: 1px solid #e9ecef;
                            }
                            .footer p {
                                color: #666;
                                font-size: 14px;
                                margin-bottom: 8px;
                            }
                            .footer .highlight {
                                color: #28a745;
                                font-weight: 600;
                            }
                            .action-buttons {
                                text-align: center;
                                margin: 25px 0;
                            }
                            .btn {
                                display: inline-block;
                                padding: 12px 24px;
                                margin: 0 10px;
                                background: linear-gradient(135deg, #1976d2 0%%, #42a5f5 100%%);
                                color: white;
                                text-decoration: none;
                                border-radius: 6px;
                                font-size: 14px;
                                font-weight: 500;
                                transition: all 0.3s ease;
                            }
                            .btn:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
                            }
                            @media only screen and (max-width: 600px) {
                                .email-container {
                                    margin: 10px;
                                    border-radius: 8px;
                                }
                                .header, .content, .footer {
                                    padding: 20px;
                                }
                                .info-grid {
                                    grid-template-columns: 1fr;
                                    gap: 15px;
                                }
                                .payment-row {
                                    flex-direction: column;
                                    align-items: flex-start;
                                    gap: 5px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <div class="icon">💰</div>
                                <h1>Thông báo thanh toán mới</h1>
                                <p>Có khách hàng vừa thanh toán thành công!</p>
                            </div>
                            
                            <div class="content">
                                <div class="notification-title">🎉 Thanh toán thành công</div>
                                
                                <div class="info-grid">
                                    <div class="info-item">
                                        <h3>👤 Khách hàng</h3>
                                        <p>%s</p>
                                    </div>
                                    <div class="info-item">
                                        <h3>📧 Email</h3>
                                        <p>%s</p>
                                    </div>
                                    <div class="info-item">
                                        <h3>🎫 Mã đặt tour</h3>
                                        <p>%s</p>
                                    </div>
                                    <div class="info-item">
                                        <h3>📅 Ngày khởi hành</h3>
                                        <p>%s</p>
                                    </div>
                                </div>
                                
                                <div class="payment-details">
                                    <h2>💳 Chi tiết thanh toán</h2>
                                    <div class="payment-row">
                                        <span class="payment-label">Tên tour:</span>
                                        <span class="payment-value">%s</span>
                                    </div>
                                    <div class="payment-row">
                                        <span class="payment-label">Số tiền:</span>
                                        <span class="payment-value">%s VND</span>
                                    </div>
                                    <div class="payment-row">
                                        <span class="payment-label">Phương thức:</span>
                                        <span class="payment-value">%s</span>
                                    </div>
                                    <div class="payment-row">
                                        <span class="payment-label">Thời gian:</span>
                                        <span class="payment-value">%s</span>
                                    </div>
                                </div>
                                
                                
                            </div>
                            
                            <div class="footer">
                                <p><strong>TravelTour</strong> - Hệ thống quản lý du lịch</p>
                                <p class="highlight">📞 Hotline: 1900 xxxx | 📧 Email: admin@traveltour.com</p>
                                <p>📍 Địa chỉ: 123 Đường Du Lịch, Quận 1, TP.HCM</p>
                                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                                    © 2024 TravelTour. Mọi quyền được bảo lưu.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """,
                    user.getFullName(), user.getEmail(),
                    booking.getBookingCode(),
                    booking.getScheduleId(),
                    booking.getTour().getName(),
                    payment.getAmount(),
                    payment.getPaymentMethod().getMethodName(),
                    payment.getPaymentDate()
                );
                for (User admin : admins) {
                    if (admin.getEmail() != null && !admin.getEmail().isEmpty()) {
                        emailService.sendHtmlEmail(admin.getEmail(), subject, content);
                    }
                }
            } catch (Exception e) {
                System.out.println("ERROR: Failed to send email: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("DEBUG: Payment status is not Completed or was already completed. Current status: " + newStatus.getStatusName() + " (ID: " + newStatus.getPaymentStatusId() + ")");
        }

        // Create history record
        PaymentHistory history = new PaymentHistory();
        history.setPayment(payment);
        history.setStatus(newStatus);
        history.setNotes(notes != null ? notes : "Status updated to " + newStatus.getStatusName());
        paymentHistoryRepository.save(history);

        // Nếu thanh toán thành công (status_id = 3), kiểm tra và cập nhật trạng thái lịch trình
        if (newStatus.getPaymentStatusId() == 3) { // 3 = Completed
            tourScheduleService.checkAndUpdateScheduleStatus(payment.getBooking().getBookingId());
        }

        return convertToDTO(payment);
    }

    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public List<PaymentStatus> getAllPaymentStatuses() {
        return paymentStatusRepository.findAll();
    }

    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponseDTO requestRefund(Integer paymentId, String notes, String email) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        // Kiểm tra user có quyền (email phải trùng với payment.user.email)
        if (!payment.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Bạn không có quyền yêu cầu hoàn tiền cho payment này!");
        }
        PaymentStatus refundStatus = paymentStatusRepository.findById(7)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái Request Refund"));
        payment.setStatus(refundStatus);
        payment = paymentRepository.save(payment);

        // Lưu lịch sử
        PaymentHistory history = new PaymentHistory();
        history.setPayment(payment);
        history.setStatus(refundStatus);
        history.setNotes(notes != null ? notes : "User requested refund");
        paymentHistoryRepository.save(history);

        return convertToDTO(payment);
    }

    @Transactional
    public PaymentResponseDTO updatePaymentStatusToSupportContact(Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        PaymentStatus supportContactStatus = paymentStatusRepository.findByStatusName("SUPPORT_CONTACT")
            .orElseThrow(() -> new RuntimeException("Payment status SUPPORT_CONTACT not found"));
        payment.setStatus(supportContactStatus);
        payment = paymentRepository.save(payment);

        // Lưu lịch sử
        PaymentHistory history = new PaymentHistory();
        history.setPayment(payment);
        history.setStatus(supportContactStatus);
        history.setNotes("Chuyển trạng thái sang SUPPORT_CONTACT");
        paymentHistoryRepository.save(history);

        return convertToDTO(payment);
    }

    public PaymentResponseDTO getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDTO(payment);
    }

    private PaymentResponseDTO convertToDTO(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setBookingId(payment.getBooking().getBookingId());
        dto.setUserId(payment.getUser().getUserid());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethodId(payment.getPaymentMethod().getMethodId());
        dto.setPaymentMethod(payment.getPaymentMethod().getMethodName());
        dto.setStatusId(payment.getStatus().getPaymentStatusId());
        dto.setStatusName(payment.getStatus().getStatusName());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        return dto;
    }

    private PaymentHistoryDTO convertToHistoryDTO(PaymentHistory history) {
        PaymentHistoryDTO dto = new PaymentHistoryDTO();
        dto.setHistoryId(history.getHistoryId());
        dto.setPaymentId(history.getPayment().getPaymentId());
        dto.setStatusId(history.getStatus().getPaymentStatusId());
        dto.setStatusName(history.getStatus().getStatusName());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }

    private String generateSignature(Map<String, String> data) {
        String raw = data.entrySet().stream()
                .filter(e -> !"signature".equals(e.getKey()))
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
        return hmacSHA256(SECRET_KEY, raw);
    }

    private String hmacSHA256(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(secretKeySpec);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA256 signature", e);
        }
    }

    public String generateVietQr(String accountNo, String accountName, int amount, String phone) throws IOException, InterruptedException {
        String url = "https://api.vietqr.io/v2/generate";
        String json = String.format(
            "{\"accountNo\":\"%s\",\"accountName\":\"%s\",\"acqId\":\"963388\",\"amount\":%d,\"addInfo\":\"%s\",\"format\":\"base64\"}",
            accountNo, accountName, amount, phone
        );
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("VietQR response: " + response.body());
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(response.body());
        if (node.has("data") && node.get("data").has("qrDataURL")) {
            return node.get("data").get("qrDataURL").asText();
        } else {
            throw new RuntimeException("Không lấy được mã QR từ VietQR: " + response.body());
        }
    }
}


