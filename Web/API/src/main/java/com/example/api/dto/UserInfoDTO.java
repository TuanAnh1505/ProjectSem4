package com.example.api.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    // private Long userid;
    private String publicId;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private Long userid;
}
