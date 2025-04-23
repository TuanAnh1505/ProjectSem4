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
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
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

    
    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String fullName, String email, String password, String phone, String address) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setAddress(address);
        user.setIsActive(false);

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

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));
        if (user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã được kích hoạt.");
        }
        user.setIsActive(true);
        userRepository.save(user);
    }

    public String loginUser(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Tài khoản không tồn tại.");
        }
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt.");
        }
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtUtil.generateToken(email);

            UserToken userToken = new UserToken();
            userToken.setUser(user);
            userToken.setToken(token);
            userToken.setCreatedat(LocalDateTime.now());
            userToken.setExpiry(LocalDateTime.now().plusHours(10));
            userTokenRepository.save(userToken);

            return token;
        }
        throw new RuntimeException("Thông tin đăng nhập không hợp lệ.");
    }

    public Map<String, Object> loginUserWithRole(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Tài khoản không tồn tại.");
        }
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt.");
        }
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtUtil.generateToken(email);

            // Save token to usertokens table
            UserToken userToken = new UserToken();
            userToken.setUser(user);
            userToken.setToken(token);
            userToken.setCreatedat(LocalDateTime.now());
            userToken.setExpiry(LocalDateTime.now().plusHours(10)); // 10 hours expiry
            userTokenRepository.save(userToken);

            // Get the user's role
            String role = user.getRoles().stream()
                    .map(Role::getRoleName)
                    .findFirst()
                    .orElse("USER");

            // Return token and role
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            return response;
        }
        throw new RuntimeException("Thông tin đăng nhập không hợp lệ.");
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Người dùng không tồn tại.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email không tồn tại trong hệ thống.");
        }

        String resetLink = "http://localhost:3000/reset-password?userId=" + user.getUserid();
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    public void resetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}