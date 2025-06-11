package com.example.api.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import com.example.api.model.Media;
import com.example.api.dto.MediaDTO;

@Data
public class ExperienceWithMediaDTO {
    private Long experienceId;
    private String userPublicId;
    private String userFullName;
    private Long tourId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private List<MediaDTO> media = new ArrayList<>();
    private String status;

    @Override
    public String toString() {
        return String.format(
                "ExperienceDTO[id=%d, tourId=%d, title='%s', status='%s', mediaCount=%d]",
                experienceId,
                tourId,
                title,
                status,
                media != null ? media.size() : 0);
    }
}
