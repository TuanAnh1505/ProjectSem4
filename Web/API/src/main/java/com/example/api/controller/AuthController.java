package com.example.api.controller;

import com.example.api.dto.RegisterRequest;
import com.example.api.dto.LoginRequest;
import com.example.api.dto.UserResponse;
import com.example.api.model.User;
import com.example.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                    registerRequest.getFullName(),
                    registerRequest.getEmail(),
                    registerRequest.getPassword(),
                    registerRequest.getPhone(),
                    registerRequest.getAddress()
            );

            // Chuyển đổi User sang UserResponse
            UserResponse userResponse = new UserResponse(
                    user.getUserid(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getAddress()
            );

            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.loginUser(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}