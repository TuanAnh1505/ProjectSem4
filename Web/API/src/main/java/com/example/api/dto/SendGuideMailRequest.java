package com.example.api.dto;
import lombok.Data;

@Data
public class SendGuideMailRequest {
    private Long guideId; // hoặc String email
    private String email;
    private String subject;
    private String content;
} 