package com.example.api.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class MediaDTO {
    private Long mediaId;
    private String fileType;
    private String fileUrl;
    private LocalDateTime uploadedAt;
    private String userPublicId; // Nếu muốn biết ai upload

    // Không chứa trường user lồng nhau!
}
