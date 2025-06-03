package com.example.api.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.api.dto.UserInfoDTO;
import com.example.api.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{publicId}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable String publicId) {
        try {
            UserInfoDTO userInfo = userService.getUserInfo(publicId);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String email = userDetails.getUsername();
        try {
            var user = userService.findByEmail(email);
            return ResponseEntity.ok(new com.example.api.dto.UserInfoDTO(
                user.getPublicId(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail(),
                user.getAddress()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/{publicId}")
    public ResponseEntity<?> updateUser(
            @PathVariable String publicId,
            @RequestBody UserInfoDTO userInfoDTO,
            @AuthenticationPrincipal com.example.api.model.User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        // Nếu muốn chỉ cho phép user tự update, có thể kiểm tra:
        // if (!userService.isOwnerOrAdmin(user, publicId)) return ResponseEntity.status(403).body("Forbidden");
        try {
            userService.updateUserInfo(
                publicId,
                userInfoDTO.getFullName(),
                userInfoDTO.getPhone(),
                userInfoDTO.getAddress()
            );
            return ResponseEntity.ok("Cập nhật thành công");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Cập nhật thất bại: " + e.getMessage());
        }
    }
}