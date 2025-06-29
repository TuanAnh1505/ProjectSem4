package com.example.api.controller;

import com.example.api.dto.RegisterRequest;
import com.example.api.dto.LoginRequest;
import com.example.api.dto.UpdateUserRequest;
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
import java.util.HashMap;

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
                    registerRequest.getPassword());
                    // registerRequest.getPhone(),
                    // registerRequest.getAddress());

            user.setIsActive(false);
            userService.saveUser(user);

            emailService.sendActivationEmail(user.getEmail(), user.getPublicId(), Boolean.TRUE.equals(registerRequest.getIsApp()), false);

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
    public ResponseEntity<?> forgotPassword(@RequestParam String email, @RequestParam(defaultValue = "false") boolean isApp) {
        try {
            userService.sendPasswordResetEmail(email, isApp);
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

    @PostMapping("/resend-activation")
    public ResponseEntity<?> resendActivationEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            Boolean isApp = Boolean.valueOf(request.get("isApp"));
            
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy tài khoản với email này.");
            }
            
            if (user.getIsActive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Tài khoản đã được kích hoạt.");
            }

            emailService.resendActivationEmail(user.getEmail(), user.getPublicId(), isApp);
            return ResponseEntity.ok("Email kích hoạt đã được gửi lại thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update-info")
    public ResponseEntity<?> updateUserInfo(@RequestParam String publicId, @Valid @RequestBody UpdateUserRequest updateRequest) {
        try {
            User updatedUser = userService.updateUserInfo(
                publicId,
                updateRequest.getFullName(),
                updateRequest.getPhone(),
                updateRequest.getAddress()
            );
            
            return ResponseEntity.ok("Thông tin tài khoản đã được cập nhật thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestParam String publicId) {
        try {
            User user = userService.findByPublicId(publicId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy thông tin người dùng");
            }
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("publicId", user.getPublicId());
            userInfo.put("email", user.getEmail());
            userInfo.put("fullName", user.getFullName());
            userInfo.put("phone", user.getPhone());
            userInfo.put("address", user.getAddress());
            
            // Lấy role đầu tiên của user (thường là role chính)
            String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getRoleName())
                .orElse("USER");
            userInfo.put("role", role);
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi lấy thông tin người dùng: " + e.getMessage());
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        try {
            User existingUser = userService.findByEmail(email);
            Map<String, Object> response = new HashMap<>();
            response.put("exists", existingUser != null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi kiểm tra email: " + e.getMessage());
        }
    }
}
