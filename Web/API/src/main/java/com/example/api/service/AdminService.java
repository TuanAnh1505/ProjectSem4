package com.example.api.service;

import com.example.api.dto.UserDTO;
import com.example.api.model.Role;
import com.example.api.model.User;
import com.example.api.repository.UserRepository;
import com.example.api.repository.RoleRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

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
                        user.getPublicId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getIsActive(),
                        user.getCreatedAt(),
                        user.getRoles().stream().anyMatch(role -> role.getRoleName().equalsIgnoreCase("GUIDE"))
                ))
                .collect(Collectors.toList());
    }

    public void deleteUserAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User does not exist."));

        // Delete the user
        userRepository.delete(user);
    }
}
