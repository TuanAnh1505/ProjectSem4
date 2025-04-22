package com.example.api.service;

import com.example.api.dto.UserDTO;
import com.example.api.model.User;
import com.example.api.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Integer> getAccountStats() {
        int totalAccounts = (int) userRepository.count();
        int activatedAccounts = userRepository.countByIsActive(true);
        int nonActivatedAccounts = totalAccounts - activatedAccounts;

        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalAccounts", totalAccounts);
        stats.put("activatedAccounts", activatedAccounts);
        stats.put("nonActivatedAccounts", nonActivatedAccounts);

        return stats;
    }


    
    public List<UserDTO> getUserDTOs() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(
                        user.getUserid(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getIsActive(),
                        user.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public int deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
        return userRepository.countByIsActive(true); 
    }
}
