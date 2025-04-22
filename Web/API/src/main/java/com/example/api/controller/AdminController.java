package com.example.api.controller;

import com.example.api.dto.UserDTO;
import com.example.api.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/account-stats")
    public Map<String, Integer> getAccountStats() {
        return adminService.getAccountStats();
    }

    @GetMapping("/users")
    public List<UserDTO> getUsers() {
        return adminService.getUserDTOs(); 
    }

    @DeleteMapping("/delete-account/{userid}")
    public ResponseEntity<Integer> deleteUser(@PathVariable Long userid) {
        int activeUsers = adminService.deleteUser(userid);
        return new ResponseEntity<>(activeUsers, HttpStatus.OK);
    }
}

