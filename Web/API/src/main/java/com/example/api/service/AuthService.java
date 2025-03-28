package com.example.api.service;

import com.example.api.dto.AuthResponse;
import com.example.api.dto.RegisterRequest;
import com.example.api.dto.LoginRequest;
import com.example.api.entity.Role;
import com.example.api.entity.User;
import com.example.api.jwt.JwtUtil;
import com.example.api.repository.IRoleRepository;
import com.example.api.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
@Service
public class AuthService {
    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        Role userRole = roleRepository.findByRoleName("USER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRoleName("USER");
                    return roleRepository.save(newRole);
                });
        user.getRoles().add(userRole);

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRoles().stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.toSet())
        );
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRoles().stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.toSet())
        );
        return new AuthResponse(token);
    }
}
