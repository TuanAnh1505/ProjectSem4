package com.example.api.service;



import com.example.api.model.Role;
import com.example.api.model.User;
import com.example.api.model.UserToken;
import com.example.api.repository.RoleRepository;
import com.example.api.repository.UserRepository;
import com.example.api.repository.UserTokenRepository;
import com.example.api.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserTokenRepository userTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String fullName, String email, String password, String phone, String address) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        // Check if email already exists
        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setAddress(address);

        // Assign default role (e.g., "USER")
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByRoleName("USER");
        if (userRole == null) {
            userRole = new Role();
            userRole.setRoleName("USER");
            roleRepository.save(userRole);
        }
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public String loginUser(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtUtil.generateToken(email);

            // Save token to usertokens table
            UserToken userToken = new UserToken();
            userToken.setUser(user);
            userToken.setToken(token);
            userToken.setCreatedat(LocalDateTime.now());
            userToken.setExpiry(LocalDateTime.now().plusHours(10)); // 10 hours expiry
            userTokenRepository.save(userToken);

            return token;
        }
        throw new RuntimeException("Invalid credentials");
    }
}