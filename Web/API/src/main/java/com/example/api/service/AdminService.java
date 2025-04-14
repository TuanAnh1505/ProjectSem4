package com.example.api.service;

import com.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
}
