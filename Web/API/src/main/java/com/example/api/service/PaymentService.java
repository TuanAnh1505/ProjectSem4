package com.example.api.service;

import com.example.api.dto.PaymentRequestDTO;
import com.example.api.enums.PaymentMethod;
import com.example.api.model.Payment;

import com.example.api.repository.PaymentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    private static final String PARTNER_CODE = "MOMO";
    private static final String ACCESS_KEY = "F8BBA842ECF85";
    private static final String SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    private static final String MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
    private static final String RETURN_URL = "http://localhost:8080/api/payment/momo-return";
    private static final String NOTIFY_URL = "http://localhost:8080/api/payment/momo-notify";

    public String createMomoPayment(PaymentRequestDTO dto) throws IOException, InterruptedException {
        String orderId = UUID.randomUUID().toString();
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

    public void saveMomoPayment(Map<String, String> params) {
        Payment payment = new Payment();
        payment.setTransactionId(params.get("orderId"));
        payment.setAmount(new BigDecimal(params.get("amount")));
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(PaymentMethod.momo);
        payment.setStatusId("0".equals(params.get("resultCode")) ? 1 : 0);
        paymentRepository.save(payment);
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
}


