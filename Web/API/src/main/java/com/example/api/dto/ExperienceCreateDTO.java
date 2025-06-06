package com.example.api.dto;

import lombok.Data;

@Data
public class ExperienceCreateDTO {
    private Long userid;
    private Long tourId;
    private String title;
    private String content;
}
