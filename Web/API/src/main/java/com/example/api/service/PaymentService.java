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

    private static final String PARTNER_CODE = "MOMO";
    private static final String ACCESS_KEY = "F8BBA842ECF85";
    private static final String SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    private static final String MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
    private static final String RETURN_URL = "http://localhost:8080/api/payments/momo/return";
    private static final String NOTIFY_URL = "http://localhost:8080/api/payments/momo/notify";

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
            try {
                User user = userRepository.findById(payment.getUser().getUserid())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(booking.getBookingId());
                emailService.sendPaymentSuccessEmail(user, booking, payment, passengers);
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

    public String createMomoPayment(PaymentRequestDTO dto) throws IOException, InterruptedException {
        // First create the payment record
        PaymentResponseDTO payment = createPayment(dto);

        String orderId = payment.getTransactionId();
        String requestId = UUID.randomUUID().toString();
        String amount = dto.getAmount().toString();

        Map<String, String> rawData = new LinkedHashMap<>();
        rawData.put("partnerCode", PARTNER_CODE);
        rawData.put("accessKey", ACCESS_KEY);
        rawData.put("requestId", requestId);
        rawData.put("amount", amount);
        rawData.put("orderId", orderId);
        rawData.put("orderInfo", "Thanh toan tour");
        rawData.put("returnUrl", RETURN_URL);
        rawData.put("notifyUrl", NOTIFY_URL);
        rawData.put("extraData", "");

        String signature = generateSignature(rawData);
        rawData.put("requestType", "captureWallet");
        rawData.put("signature", signature);
        rawData.put("lang", "vi");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(MOMO_ENDPOINT))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(new ObjectMapper().writeValueAsString(rawData)))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode json = new ObjectMapper().readTree(response.body());
        return json.get("payUrl").asText();
    }

    @Transactional
    public PaymentResponseDTO handleMomoReturn(Map<String, String> params) {
        String orderId = params.get("orderId");
        String resultCode = params.get("resultCode");

        Payment payment = paymentRepository.findByTransactionId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update payment status based on MoMo response
        PaymentStatus newStatus = paymentStatusRepository.findById(
                "0".equals(resultCode) ? 3 : 4) // 3 = Completed, 4 = Failed
                .orElseThrow(() -> new RuntimeException("Payment status not found"));

        return updatePaymentStatus(payment.getPaymentId(), newStatus.getPaymentStatusId(),
                "MoMo payment " + ("0".equals(resultCode) ? "successful" : "failed"));
    }

    @Transactional
    public void handleMomoNotify(Map<String, String> params) {
        // Similar to handleMomoReturn but for server-to-server notification
        handleMomoReturn(params);
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
        dto.setNotes(payment.getNotes());
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
        dto.setNotes(history.getNotes());
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


