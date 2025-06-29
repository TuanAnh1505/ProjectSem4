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

    public User registerUser(String fullName, String email, String password) {
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
            // user.setPhone(phone);
            // user.setAddress(address);
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

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác.");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự.");
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

    public User createGuideUserAndSendMail(String fullName, String email, String password, String phone,
            String address) {
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
        String subject = "Thông tin tài khoản hướng dẫn viên TravelTour";
        String content = String.format(
                """
                        <!DOCTYPE html>
                        <html lang="vi">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Xin chào!</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6;">
                            <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
                                <tr>
                                    <td align="center">
                                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; margin: 20px 0; border-collapse: collapse;">
                                            <!-- Header -->
                                            <tr>
                                                <td style="background-color: #004a99; padding: 15px 30px; text-align: left;">
                                                     <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">TravelTour</h1>
                                                </td>
                                            </tr>
                                            <!-- Banner Image -->
                                            <tr>
                                                <td>
                                                    <img src="https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop" alt="Beach Banner" style="width: 100%%; height: auto; display: block;">
                                                </td>
                                            </tr>
                                            <!-- Content -->
                                            <tr>
                                                <td style="padding: 40px 30px 30px 30px; text-align: center;">
                                                    <h2 style="color: #004a99; font-size: 28px; margin: 0 0 10px 0;">Xin chào!</h2>
                                                    <p style="color: #333333; font-size: 16px;">Admin đã tạo cho bạn tài khoản hướng dẫn viên trên hệ thống TravelTour.</p>
                                                    <p style="font-size: 16px; margin-bottom: 30px;"><a href="http://localhost:3000/login" style="color: #007bff; text-decoration: none;">Hãy đăng nhập và đổi mật khẩu sau khi sử dụng lần đầu.</a></p>

                                                    <!-- Credentials Box -->
                                                    <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center">
                                                                <table width="80%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f2f8fe; border-radius: 8px; padding: 25px;">
                                                                    <tr>
                                                                        <td style="font-size: 16px; color: #333333; line-height: 1.7;">
                                                                            <p style="margin: 0;"><strong>Email đăng nhập:</strong> %s</p>
                                                                            <p style="margin: 10px 0 0 0;"><strong>Mật khẩu:</strong> %s</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Footer -->
                                            <tr>
                                                <td style="padding: 20px 30px; text-align: center; color: #888888; font-size: 14px; border-top: 1px solid #eeeeee;">
                                                    <p style="margin: 0;">Trân trọng,<br><strong style="color: #555555;">Đội ngũ TravelTour</strong></p>
                                                    <p style="margin-top: 20px;">
                                                        Cần hỗ trợ? Liên hệ với chúng tôi qua <a href="mailto:support@traveltour.com" style="color: #007bff; text-decoration: none;">support@traveltour.com</a>
                                                    </p>
                                                    <p style="font-size: 12px; color: #aaaaaa; margin-top: 15px;">
                                                        &copy; 2025 TravelTour. Tất cả các quyền được bảo lưu.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                        """,
                email, password);
        emailService.sendHtmlEmail(email, subject, content);
        return user;
    }
}