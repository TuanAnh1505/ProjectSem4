package com.example.api.controller;

import com.example.api.dto.RegisterRequest;
import com.example.api.dto.LoginRequest;
import com.example.api.model.User;
import com.example.api.service.UserService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import com.example.api.service.EmailService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                    registerRequest.getFullName(),
                    registerRequest.getEmail(),
                    registerRequest.getPassword(),
                    registerRequest.getPhone(),
                    registerRequest.getAddress());

            user.setIsActive(false);
            userService.saveUser(user);

            emailService.sendActivationEmail(user.getEmail(), user.getPublicId(), Boolean.TRUE.equals(registerRequest.getIsApp()));

            return ResponseEntity.ok("Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String publicId) {
        try {
            userService.activateUser(publicId);
            return ResponseEntity.ok("Tài khoản đã được kích hoạt thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = userService.loginUserWithRole(
                    loginRequest.getEmail(),
                    loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            userService.sendPasswordResetEmail(email);
            return ResponseEntity.ok("Email đặt lại mật khẩu đã được gửi.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String publicId = request.get("publicId");
            String newPassword = request.get("newPassword");
            userService.resetPassword(publicId, newPassword);
            return ResponseEntity.ok("Mật khẩu đã được đặt lại thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            userService.changePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
