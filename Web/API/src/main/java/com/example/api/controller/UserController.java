package com.example.api.controller;

import java.util.UUID;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.api.dto.UserInfoDTO;
import com.example.api.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
                    user.getAddress()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/{publicId}")
    public ResponseEntity<?> updateUser(
            @PathVariable String publicId,
            @RequestBody UserInfoDTO userInfoDTO,
            @AuthenticationPrincipal String email) {
        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        var user = userService.findByEmail(email);
        if (!user.getPublicId().equals(publicId)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            userService.updateUserInfo(
                    publicId,
                    userInfoDTO.getFullName(),
                    userInfoDTO.getPhone(),
                    userInfoDTO.getAddress());
            return ResponseEntity.ok("Cập nhật thành công");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Cập nhật thất bại: " + e.getMessage());
        }
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> passwordRequest) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        try {
            String email = userDetails.getUsername();
            String oldPassword = passwordRequest.get("oldPassword");
            String newPassword = passwordRequest.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                 return ResponseEntity.badRequest().body(Map.of("error", "Old and new passwords must be provided."));
            }

            userService.changePassword(email, oldPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred."));
        }
    }
}