package com.example.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.api.dto.UserInfoDTO;
import com.example.api.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable Long id) {
        try {
            UserInfoDTO userInfo = userService.getUserInfo(id);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}