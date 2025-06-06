package com.example.api.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import com.example.api.model.Media;

@Data
public class ExperienceWithMediaDTO {
    private Long experienceId;
    private String userPublicId;
    private String userFullName;
    private Long tourId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private List<Media> media;
    private String status;
    // getters, setters
}
