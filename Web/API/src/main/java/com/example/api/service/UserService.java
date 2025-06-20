package com.example.api.service;

import com.example.api.dto.UserInfoDTO;
import com.example.api.model.Discount;
import com.example.api.model.Role;
import com.example.api.model.User;
import com.example.api.model.UserToken;
import com.example.api.model.UserRole;
import com.example.api.repository.DiscountRepository;
import com.example.api.repository.RoleRepository;
import com.example.api.repository.UserRepository;
import com.example.api.repository.UserTokenRepository;
import com.example.api.repository.UserRoleRepository;
import com.example.api.util.JwtUtil;

// import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {
   
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private UserTokenRepository userTokenRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String fullName, String email, String password, String phone, String address) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        try {
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setPhone(phone);
            user.setAddress(address);
            user.setIsActive(false);
            user.setPublicId(UUID.randomUUID().toString());

            // Gán role mặc định USER
            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByRoleName("USER");
            if (userRole == null) {
                userRole = new Role();
                userRole.setRoleName("USER");
                roleRepository.save(userRole);
            }
            roles.add(userRole);
            user.setRoles(roles);

            // Lưu người dùng vào DB
            User savedUser = userRepository.save(user);

            // Gửi email kích hoạt
            emailService.sendActivationEmail(savedUser.getEmail(), savedUser.getPublicId(), true, false);

            // Gửi mã giảm giá NEWUSER10 nếu còn hạn
            Discount welcome = discountRepository.findByCode("NEWUSER10").orElse(null);
            if (welcome != null && LocalDateTime.now().isBefore(welcome.getEndDate())) {
                emailService.sendDiscountCodeEmail(savedUser.getEmail(), welcome.getCode(), welcome.getDescription());
            }

            return savedUser;
        } catch (Exception e) {
            throw new RuntimeException("Error registering user: " + e.getMessage(), e);
        }
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public void activateUser(String publicId) {
        User user = userRepository.findByPublicId(publicId)
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
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt.");
        }
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtUtil.generateToken(email);

            UserToken userToken = new UserToken();
            userToken.setUser(user);
            userToken.setToken(token);
            userToken.setCreatedat(LocalDateTime.now());
            userToken.setExpiry(LocalDateTime.now().plusMinutes(10));
            userTokenRepository.save(userToken);

            return token;
        }
        throw new RuntimeException("Thông tin đăng nhập không hợp lệ.");
    }

    public Map<String, Object> loginUserWithRole(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt.");
        }
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtUtil.generateToken(email);

            UserToken userToken = new UserToken();
            userToken.setUser(user);
            userToken.setToken(token);
            userToken.setCreatedat(LocalDateTime.now());
            userToken.setExpiry(LocalDateTime.now().plusMinutes(10));
            userTokenRepository.save(userToken);

            String role = user.getRoles().stream()
                    .map(Role::getRoleName)
                    .findFirst()
                    .orElse("USER");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("publicId", user.getPublicId());
            response.put("userId", user.getUserid());
            return response;
        }
        throw new RuntimeException("Thông tin đăng nhập không hợp lệ.");
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void sendPasswordResetEmail(String email, boolean isApp) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        emailService.sendPasswordResetEmail(user.getEmail(), user.getPublicId(), isApp);
    }

    public void resetPassword(String publicId, String newPassword) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public UserInfoDTO getUserInfo(String publicId) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserInfoDTO.builder()
                // .userid(user.getUserid())
                .publicId(user.getPublicId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .address(user.getAddress())
                .build();
    }

    @Scheduled(fixedRate = 36000000)
    public void deleteExpiredTokens() {
        userTokenRepository.deleteAllByExpiryBefore(LocalDateTime.now());
        jdbcTemplate.execute("ALTER TABLE usertokens AUTO_INCREMENT = 1");
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
    }

    public User updateUserInfo(String publicId, String fullName, String phone, String address) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));

        user.setFullName(fullName);
        user.setPhone(phone);
        user.setAddress(address);

        return userRepository.save(user);
    }

    public User findByPublicId(String publicId) {
        return userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + publicId));
    }

    public User createGuideUser(String fullName, String email, String password, String phone, String address) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setAddress(address);
        user.setIsActive(false);
        user.setPublicId(UUID.randomUUID().toString());
        user = userRepository.save(user);
        // Gán role GUIDE
        Role guideRole = roleRepository.findByRoleName("GUIDE");
        if (guideRole == null) {
            throw new RuntimeException("Role GUIDE không tồn tại!");
        }
        userRoleRepository.save(new UserRole(user.getUserid(), guideRole.getRoleid()));
        // Gửi email kích hoạt
        emailService.sendActivationEmail(user.getEmail(), user.getPublicId(), true, true);
        return user;
    }

    public User createGuideUserAndSendMail(String fullName, String email, String password, String phone, String address) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setAddress(address);
        user.setIsActive(true); // Kích hoạt luôn
        user.setPublicId(UUID.randomUUID().toString());
        user = userRepository.save(user);
        // Gán role GUIDE
        Role guideRole = roleRepository.findByRoleName("GUIDE");
        if (guideRole == null) {
            throw new RuntimeException("Role GUIDE không tồn tại!");
        }
        userRoleRepository.save(new UserRole(user.getUserid(), guideRole.getRoleid()));
        // Gửi mail thông tin tài khoản
        String subject = "Thông tin tài khoản hướng dẫn viên";
        String content = "<p>Xin chào,</p>"
            + "<p>Admin đã tạo cho bạn tài khoản hướng dẫn viên trên hệ thống TravelTour.</p>"
            + "<p><b>Email đăng nhập:</b> " + email + "<br/>"
            + "<b>Mật khẩu:</b> " + password + "</p>"
            + "<p>Hãy đăng nhập và đổi mật khẩu sau khi sử dụng lần đầu.</p>"
            + "<p>Trân trọng,<br>Đội ngũ TravelTour</p>";
        emailService.sendHtmlEmail(email, subject, content);
        return user;
    }
}