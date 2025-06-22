package com.example.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class DestinationDTO {
    private Integer id;
    private String name;
    private String description;
    private String category;
    private String location;
    private Double rating;
    private List<String> imageUrls;
}