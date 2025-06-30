package com.example.api.service;

import com.example.api.model.Booking;
import com.example.api.model.BookingPassenger;
import com.example.api.model.Payment;
import com.example.api.model.User;
import com.example.api.dto.TourItineraryDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import java.util.List;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.Comparator;
import com.example.api.repository.TourScheduleRepository;
import java.util.HashSet;
import java.util.Set;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TourScheduleRepository tourScheduleRepository;

    public void sendActivationEmail(String to, String publicId, boolean isApp, boolean isGuide) {
        logger.info("Preparing to send activation email to: {}", to);
        try {
            String webLink = "http://localhost:3000/activate?publicId=" + publicId;
            String appLink = "myapp://activate?publicId=" + publicId;

            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);

            String htmlContent;
            if (isGuide) {
                helper.setSubject("Kích hoạt tài khoản Hướng dẫn viên - TravelTour");
                htmlContent = generateEmailTemplate(
                    "Kích hoạt tài khoản Hướng dẫn viên",
                    "Chúc mừng bạn đã được admin tạo tài khoản hướng dẫn viên tại TravelTour.",
                    "Vui lòng kích hoạt tài khoản để bắt đầu sử dụng các chức năng dành cho hướng dẫn viên.",
                    webLink, appLink, isApp, "Kích hoạt tài khoản"
                );
            } else {
                helper.setSubject("Kích hoạt tài khoản TravelTour");
                htmlContent = generateEmailTemplate(
                    "Kích hoạt tài khoản TravelTour",
                    "Cảm ơn bạn đã đăng ký tài khoản tại TravelTour.",
                    "Bạn có thể kích hoạt tài khoản bằng cách nhấp vào liên kết bên dưới:",
                    webLink, appLink, isApp, "Kích hoạt tài khoản"
                );
            }
            
            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            logger.info("Successfully sent activation email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send activation email to: {}. Error: {}", to, e.getMessage());
            // Don't throw exception to prevent registration failure
            // Instead, log the error and continue
            logger.warn("Email sending failed, but user registration will continue. User can request email resend later.");
        }
    }

    private String generateEmailTemplate(String title, String greeting, String description, 
                                       String webLink, String appLink, boolean isApp, String buttonText) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f6f8;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #1976d2 0%%, #42a5f5 100%%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin-bottom: 10px;
                    }
                    .header p {
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #1976d2;
                        margin-bottom: 20px;
                        font-weight: 500;
                    }
                    .description {
                        font-size: 16px;
                        color: #555;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    .button-container {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .cta-button {
                        display: inline-block;
                        padding: 16px 32px;
                        background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
                    }
                    .cta-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
                    }
                    .app-button {
                        display: inline-block;
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #6f42c1 0%%, #8e44ad 100%%);
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 500;
                        margin-top: 15px;
                        transition: all 0.3s ease;
                    }
                    .app-button:hover {
                        transform: translateY(-1px);
                    }
                    .info-box {
                        background-color: #e3f2fd;
                        border-left: 4px solid #1976d2;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 0 8px 8px 0;
                    }
                    .info-box h3 {
                        color: #1976d2;
                        margin-bottom: 10px;
                        font-size: 16px;
                    }
                    .info-box p {
                        color: #555;
                        font-size: 14px;
                        margin: 0;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e9ecef;
                    }
                    .footer p {
                        color: #666;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    .footer .contact-info {
                        color: #1976d2;
                        font-weight: 500;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    @media only screen and (max-width: 600px) {
                        .email-container {
                            margin: 10px;
                            border-radius: 8px;
                        }
                        .header, .content, .footer {
                            padding: 20px;
                        }
                        .header h1 {
                            font-size: 24px;
                        }
                        .cta-button {
                            padding: 14px 28px;
                            font-size: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <div class="logo">🌍 TravelTour</div>
                        <h1>%s</h1>
                        <p>Khám phá Việt Nam cùng chúng tôi</p>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Xin chào!</div>
                        <div class="description">
                            %s<br><br>
                            %s
                        </div>
                        
                        <div class="button-container">
                            <a href="%s" class="cta-button">%s trên Web</a>
                            %s
                        </div>
                        
                        <div class="info-box">
                            <h3>📧 Thông tin quan trọng</h3>
                            <p>• Liên kết này sẽ hết hạn sau 24 giờ<br>
                            • Đảm bảo bạn đang sử dụng trình duyệt an toàn<br>
                            • Nếu có vấn đề, vui lòng liên hệ hỗ trợ</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>TravelTour</strong> - Dịch vụ du lịch hàng đầu Việt Nam</p>
                        <p class="contact-info">📞 Hotline: 1900 xxxx | 📧 Email: support@traveltour.com</p>
                        <p>📍 Địa chỉ: 123 Đường Du Lịch, Quận 1, TP.HCM</p>
                        <p style="margin-top: 15px; font-size: 12px; color: #999;">
                            © 2024 TravelTour. Mọi quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """,
            title, title, greeting, description, webLink, buttonText,
            isApp ? String.format("<br><a href=\"%s\" class=\"app-button\">%s trên App</a>", appLink, buttonText) : ""
        );
    }

    public void sendPasswordResetEmail(String to, String publicId, boolean isApp) {
        logger.info("Preparing to send password reset email to: {}", to);
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Đặt lại mật khẩu - TravelTour");

            String webLink = "http://localhost:3000/reset-password?publicId=" + publicId;
            String appLink = "myapp://reset-password?publicId=" + publicId;

            String htmlContent = generateEmailTemplate(
                "Đặt lại mật khẩu TravelTour",
                "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.",
                "Vui lòng chọn một trong các cách sau để đặt lại mật khẩu:",
                webLink, appLink, isApp, "Đặt lại mật khẩu"
            );

            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            logger.info("Successfully sent password reset email to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    public void sendDiscountCodeEmail(String to, String code, String description) {
        logger.info("Preparing to send discount code email to: {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã giảm giá đặc biệt từ TravelTour");
        message.setText("Xin chào,\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản tại TravelTour. " +
                "Chúng tôi gửi tặng bạn mã giảm giá đặc biệt:\n\n" +
                "Mã giảm giá: " + code + "\n" +
                "Mô tả: " + description + "\n\n" +
                "Hãy sử dụng mã này trong lần đặt tour đầu tiên của bạn!\n\n" +
                "Trân trọng,<br>Đội ngũ TravelTour");
        try {
            emailSender.send(message);
            logger.info("Successfully sent discount code email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send discount code email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }
    }

    public void resendActivationEmail(String to, String publicId, boolean isApp) {
        logger.info("Preparing to resend activation email to: {}", to);
        try {
            String webLink = "http://localhost:3000/activate?publicId=" + publicId;
            String appLink = "myapp://activate?publicId=" + publicId;

            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Yêu cầu gửi lại email kích hoạt - TravelTour");

            String htmlContent = generateEmailTemplate(
                "Gửi lại email kích hoạt",
                "Chúng tôi nhận được yêu cầu gửi lại email kích hoạt tài khoản TravelTour của bạn.",
                "Bạn có thể kích hoạt tài khoản bằng cách nhấp vào liên kết bên dưới:",
                webLink, appLink, isApp, "Kích hoạt tài khoản"
            );

            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            logger.info("Successfully resent activation email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to resend activation email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Gửi lại email kích hoạt thất bại: " + e.getMessage());
        }
    }

    public void sendPaymentSuccessEmail(User user, Booking booking, Payment payment,
            List<BookingPassenger> passengers) {
        logger.info("Preparing to send payment success email to all passengers with emails");
        try {
            // Get schedule information
            var scheduleOpt = tourScheduleRepository.findById(booking.getScheduleId());
            String startDate = "N/A";
            String endDate = "N/A";

            if (scheduleOpt.isPresent()) {
                var schedule = scheduleOpt.get();
                startDate = schedule.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                endDate = schedule.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }

            String subject = "Xác nhận thanh toán thành công - Đặt tour " + booking.getBookingId();

            String content = String.format(
                    """
                            <html>
                            <head>
                                <meta charset="UTF-8">
                            </head>
                            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                    <div style="text-align: center; margin-bottom: 30px;">
                                        <h1 style="color: #28a745; margin-bottom: 10px;">Thanh toán thành công!</h1>
                                        <p style="color: #666;">Cảm ơn bạn đã đặt tour với TravelTour</p>
                                    </div>

                                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                        <h2 style="color: #1976d2; margin-top: 0;">Thông tin đặt tour</h2>
                                        <p><strong>Mã đặt tour:</strong> %s</p>
                                        <p><strong>Tên tour:</strong> %s</p>
                                        <p><strong>Ngày khởi hành:</strong> %s</p>
                                        <p><strong>Ngày kết thúc:</strong> %s</p>
                                    </div>

                                    <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                        <h2 style="color: #17a2b8; margin-top: 0;">Thông tin thanh toán</h2>
                                        <p><strong>Tổng tiền:</strong> %s VND</p>
                                        <p><strong>Phương thức thanh toán:</strong> %s</p>
                                        <p><strong>Trạng thái:</strong> <span style="color: #28a745;">Đã thanh toán thành công</span></p>
                                    </div>

                                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                        <h2 style="color: #1976d2; margin-top: 0;">Danh sách hành khách</h2>
                                        <table style="width: 100%%; border-collapse: collapse; margin-top: 10px;">
                                            <tr style="background-color: #e9ecef;">
                                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Họ và tên</th>
                                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Số điện thoại</th>
                                            </tr>
                                            %s
                                        </table>
                                    </div>

                                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                                        <h2 style="color: #1976d2; margin-top: 0;">Lưu ý quan trọng</h2>
                                        <ul style="padding-left: 20px;">
                                            <li>Vui lòng đến đúng điểm đón trước giờ khởi hành 30 phút</li>
                                            <li>Mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)</li>
                                            <li>Chuẩn bị đồ dùng cá nhân cần thiết</li>
                                            <li>Nếu có thắc mắc, vui lòng liên hệ hotline: 1900 xxxx</li>
                                        </ul>
                                    </div>

                                    <div style="margin-top: 30px; text-align: center; color: #666;">
                                        <p>Trân trọng,<br>Đội ngũ TravelTour</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                            """,
                    booking.getBookingCode(),
                    booking.getTour().getName(),
                    startDate,
                    endDate,
                    payment.getAmount(),
                    payment.getPaymentMethod().getMethodName(),
                    generatePassengerTableRows(passengers));

            // Tạo danh sách email duy nhất để gửi
            Set<String> uniqueEmails = new HashSet<>();
            
            // Thêm email của user chính
            if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
                uniqueEmails.add(user.getEmail().trim());
            }
            
            // Thêm email của tất cả passengers có email
            for (BookingPassenger passenger : passengers) {
                if (passenger.getEmail() != null && !passenger.getEmail().trim().isEmpty()) {
                    uniqueEmails.add(passenger.getEmail().trim());
                }
            }

            logger.info("Sending payment success email to {} unique email addresses: {}", 
                       uniqueEmails.size(), uniqueEmails);

            // Gửi email cho tất cả email duy nhất
            for (String email : uniqueEmails) {
                try {
                    MimeMessage mimeMessage = emailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                    helper.setTo(email);
                    helper.setSubject(subject);
                    helper.setText(content, true);
                    helper.setFrom("noreply@traveltour.com", "TravelTour");
                    emailSender.send(mimeMessage);
                    logger.info("Successfully sent payment success email to: {}", email);
                } catch (Exception e) {
                    logger.error("Failed to send payment success email to: {}. Error: {}", email, e.getMessage());
                    // Tiếp tục gửi cho các email khác nếu một email bị lỗi
                }
            }
        } catch (Exception e) {
            logger.error("Failed to prepare payment success email. Error: {}", e.getMessage());
            e.printStackTrace();
        }
    }

    private String generatePassengerTableRows(List<BookingPassenger> passengers) {
        StringBuilder rows = new StringBuilder();
        for (BookingPassenger passenger : passengers) {
            rows.append(String.format("""
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">%s</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">%s</td>
                    </tr>
                    """,
                    passenger.getFullName(),
                    passenger.getPhone() != null ? passenger.getPhone() : "N/A"));
        }
        return rows.toString();
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        logger.info("Preparing to send HTML email to: {}", to);
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            logger.info("Successfully sent HTML email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send HTML email to: {}. Error: {}", to, e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendFeedbackRequestEmail(String to, String userName, String tourName, String endDate,
            String webFeedbackLink, String appFeedbackLink) {
        String subject = "Yêu cầu đánh giá tour " + tourName;
        String content = String.format(
                """
                        <html>
                        <head>
                            <meta charset='UTF-8'>
                        </head>
                        <body style='background: #f4f6f8; margin: 0; padding: 0;'>
                            <table width='100%%' cellpadding='0' cellspacing='0' style='background: #f4f6f8; padding: 0; margin: 0;'>
                                <tr>
                                    <td align='center'>
                                        <table width='600' cellpadding='0' cellspacing='0' style='background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin: 32px 0; padding: 0;'>
                                            <tr>
                                                <td style='padding: 40px 32px 32px 32px; text-align: left; font-family: Segoe UI, Arial, sans-serif;'>
                                                    <h1 style='color: #1976d2; font-size: 2.1rem; margin-bottom: 10px; margin-top: 0;'>Xin chào %s,</h1>
                                                    <p style='font-size: 1.13rem; color: #222; margin: 0 0 10px 0;'>Tour <b>%s</b> của bạn đã kết thúc vào ngày <b>%s</b>.</p>
                                                    <p style='font-size: 1.13rem; color: #222; margin: 0 0 28px 0;'>Chúng tôi rất mong nhận được đánh giá của bạn về trải nghiệm tour này.</p>
                                                    <div style='text-align: center; margin: 32px 0 18px 0;'>
                                                        <a href='%s' style='display: inline-block; padding: 16px 40px; background: #1976d2; color: #fff; text-decoration: none; border-radius: 8px; font-size: 1.15rem; font-weight: 600; box-shadow: 0 2px 8px rgba(25,118,210,0.08); letter-spacing: 0.5px;'>Gửi đánh giá ngay</a>
                                                    </div>
                                                    <p style='font-size: 1rem; color: #444; margin-bottom: 16px; text-align: center;'>Hoặc bạn có thể mở ứng dụng di động và truy cập vào phần đánh giá tour:</p>
                                                    <div style='text-align: center; margin-bottom: 32px;'>
                                                        <a href='%s' style='display: inline-block; padding: 12px 32px; background: #43a047; color: #fff; text-decoration: none; border-radius: 8px; font-size: 1rem; font-weight: 500;'>Đánh giá qua App</a>
                                                    </div>
                                                    <div style='background: #f8f9fa; border-radius: 6px; padding: 18px 18px 14px 18px; color: #666; font-size: 1rem; margin-bottom: 30px;'>
                                                        <b style='color: #1976d2;'>Lưu ý:</b> Đánh giá của bạn sẽ giúp chúng tôi cải thiện dịch vụ tốt hơn.<br>
                                                        Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ: <a href='mailto:support@traveltour.com' style='color: #1976d2;'>support@traveltour.com</a> hoặc hotline: 1900 xxxx.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding: 0 32px 28px 32px; text-align: left; font-family: Segoe UI, Arial, sans-serif; color: #888; font-size: 0.98rem; border-top: 1px solid #eee;'>
                                                    <div style='margin-top: 24px;'>
                                                        <span style='color: #888;'>© %d TravelTour. Mọi quyền được bảo lưu.</span><br>
                                                        <span style='color: #888;'>Địa chỉ: 123 Đường Du Lịch, Quận 1, TP.HCM</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                        """,
                userName, tourName, endDate, webFeedbackLink, appFeedbackLink, java.time.Year.now().getValue());
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            helper.setFrom("feedback@traveltour.com", "TravelTour Feedback");
            emailSender.send(mimeMessage);
            logger.info("Successfully sent feedback request email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send feedback request email to: {}. Error: {}", to, e.getMessage());
            e.printStackTrace();
        }
    }

    // Method mới để gửi email yêu cầu feedback cho tất cả passengers
    public void sendFeedbackRequestEmailToAllPassengers(User user, List<BookingPassenger> passengers,
            String tourName, String endDate, String webFeedbackLink, String appFeedbackLink) {
        logger.info("Preparing to send feedback request email to all passengers with emails");
        
        // Tạo danh sách email duy nhất
        Set<String> uniqueEmails = new HashSet<>();
        
        // Thêm email của user chính
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            uniqueEmails.add(user.getEmail().trim());
        }
        
        // Thêm email của tất cả passengers có email
        for (BookingPassenger passenger : passengers) {
            if (passenger.getEmail() != null && !passenger.getEmail().trim().isEmpty()) {
                uniqueEmails.add(passenger.getEmail().trim());
            }
        }

        logger.info("Sending feedback request email to {} unique email addresses: {}", 
                   uniqueEmails.size(), uniqueEmails);

        String subject = "Yêu cầu đánh giá tour " + tourName;
        String content = String.format(
                """
                        <html>
                        <head>
                            <meta charset='UTF-8'>
                        </head>
                        <body style='background: #f4f6f8; margin: 0; padding: 0;'>
                            <table width='100%%' cellpadding='0' cellspacing='0' style='background: #f4f6f8; padding: 0; margin: 0;'>
                                <tr>
                                    <td align='center'>
                                        <table width='600' cellpadding='0' cellspacing='0' style='background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin: 32px 0; padding: 0;'>
                                            <tr>
                                                <td style='padding: 40px 32px 32px 32px; text-align: left; font-family: Segoe UI, Arial, sans-serif;'>
                                                    <h1 style='color: #1976d2; font-size: 2.1rem; margin-bottom: 10px; margin-top: 0;'>Xin chào,</h1>
                                                    <p style='font-size: 1.13rem; color: #222; margin: 0 0 10px 0;'>Tour <b>%s</b> đã kết thúc vào ngày <b>%s</b>.</p>
                                                    <p style='font-size: 1.13rem; color: #222; margin: 0 0 28px 0;'>Chúng tôi rất mong nhận được đánh giá của bạn về trải nghiệm tour này.</p>
                                                    <div style='text-align: center; margin: 32px 0 18px 0;'>
                                                        <a href='%s' style='display: inline-block; padding: 16px 40px; background: #1976d2; color: #fff; text-decoration: none; border-radius: 8px; font-size: 1.15rem; font-weight: 600; box-shadow: 0 2px 8px rgba(25,118,210,0.08); letter-spacing: 0.5px;'>Gửi đánh giá ngay</a>
                                                    </div>
                                                    <p style='font-size: 1rem; color: #444; margin-bottom: 16px; text-align: center;'>Hoặc bạn có thể mở ứng dụng di động và truy cập vào phần đánh giá tour:</p>
                                                    <div style='text-align: center; margin-bottom: 32px;'>
                                                        <a href='%s' style='display: inline-block; padding: 12px 32px; background: #43a047; color: #fff; text-decoration: none; border-radius: 8px; font-size: 1rem; font-weight: 500;'>Đánh giá qua App</a>
                                                    </div>
                                                    <div style='background: #f8f9fa; border-radius: 6px; padding: 18px 18px 14px 18px; color: #666; font-size: 1rem; margin-bottom: 30px;'>
                                                        <b style='color: #1976d2;'>Lưu ý:</b> Đánh giá của bạn sẽ giúp chúng tôi cải thiện dịch vụ tốt hơn.<br>
                                                        Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ: <a href='mailto:support@traveltour.com' style='color: #1976d2;'>support@traveltour.com</a> hoặc hotline: 1900 xxxx.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding: 0 32px 28px 32px; text-align: left; font-family: Segoe UI, Arial, sans-serif; color: #888; font-size: 0.98rem; border-top: 1px solid #eee;'>
                                                    <div style='margin-top: 24px;'>
                                                        <span style='color: #888;'>© %d TravelTour. Mọi quyền được bảo lưu.</span><br>
                                                        <span style='color: #888;'>Địa chỉ: 123 Đường Du Lịch, Quận 1, TP.HCM</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                        """,
                tourName, endDate, webFeedbackLink, appFeedbackLink, java.time.Year.now().getValue());

        // Gửi email cho tất cả email duy nhất
        for (String email : uniqueEmails) {
            try {
                MimeMessage mimeMessage = emailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setTo(email);
                helper.setSubject(subject);
                helper.setText(content, true);
                helper.setFrom("feedback@traveltour.com", "TravelTour Feedback");
                emailSender.send(mimeMessage);
                logger.info("Successfully sent feedback request email to: {}", email);
            } catch (Exception e) {
                logger.error("Failed to send feedback request email to: {}. Error: {}", email, e.getMessage());
                // Tiếp tục gửi cho các email khác nếu một email bị lỗi
            }
        }
    }

    public void sendTourReminderEmail(String to, String userName, String tourName, String startDate,
            String endDate, String tourDetails) {
        String subject = "Nhắc nhở: Tour " + tourName + " sẽ bắt đầu sau 2 ngày";
        String content = String.format(
                """
                        <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2 style="color: #1976d2;">Xin chào %s,</h2>
                                <p>Tour <strong>%s</strong> của bạn sẽ bắt đầu sau <strong>2 ngày</strong> (ngày <strong>%s</strong>) và kết thúc vào ngày <strong>%s</strong>.</p>

                                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #28a745; margin-top: 0;">Thông tin quan trọng:</h3>
                                    <p><strong>Thời gian tập trung:</strong> 30 phút trước giờ khởi hành</p>
                                    <p><strong>Ngày khởi hành:</strong> %s</p>
                                </div>

                                <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #17a2b8; margin-top: 0;">Chi tiết tour:</h3>
                                    %s
                                </div>

                                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #856404; margin-top: 0;">Lưu ý quan trọng:</h3>
                                    <ul>
                                        <li>Vui lòng mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)</li>
                                        <li>Mang theo đồ dùng cá nhân cần thiết</li>
                                        <li>Đến đúng điểm hẹn trước giờ khởi hành</li>
                                        <li>Kiểm tra lại hành lý và đồ dùng cá nhân</li>
                                        <li>Chuẩn bị sẵn sàng cho chuyến đi</li>
                                    </ul>
                                </div>

                                <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:</p>
                                <ul>
                                    <li>Hotline: 1900 xxxx</li>
                                    <li>Email: support@traveltour.com</li>
                                </ul>

                                <p>Chúc bạn có một chuyến đi thú vị!</p>
                                <p>Trân trọng,<br>Đội ngũ TravelTour</p>
                            </div>
                        </body>
                        </html>
                        """,
                userName, tourName, startDate, endDate, startDate, tourDetails);
        sendHtmlEmail(to, subject, content);
    }

    // Method mới để gửi email nhắc nhở cho tất cả passengers
    public void sendTourReminderEmailToAllPassengers(User user, List<BookingPassenger> passengers, 
            String tourName, String startDate, String endDate, String tourDetails) {
        logger.info("Preparing to send tour reminder email to all passengers with emails");
        
        // Tạo danh sách email duy nhất
        Set<String> uniqueEmails = new HashSet<>();
        
        // Thêm email của user chính
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            uniqueEmails.add(user.getEmail().trim());
        }
        
        // Thêm email của tất cả passengers có email
        for (BookingPassenger passenger : passengers) {
            if (passenger.getEmail() != null && !passenger.getEmail().trim().isEmpty()) {
                uniqueEmails.add(passenger.getEmail().trim());
            }
        }

        logger.info("Sending tour reminder email to {} unique email addresses: {}", 
                   uniqueEmails.size(), uniqueEmails);

        String subject = "Nhắc nhở: Tour " + tourName + " sẽ bắt đầu sau 1 ngày";
        String content = String.format(
                """
                        <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2 style="color: #1976d2;">Xin chào,</h2>
                                <p>Tour <strong>%s</strong> sẽ bắt đầu sau <strong>1 ngày</strong> (ngày <strong>%s</strong>) và kết thúc vào ngày <strong>%s</strong>.</p>

                                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #28a745; margin-top: 0;">Thông tin quan trọng:</h3>
                                    <p><strong>Thời gian tập trung:</strong> 30 phút trước giờ khởi hành</p>
                                    <p><strong>Ngày khởi hành:</strong> %s</p>
                                </div>

                                <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #17a2b8; margin-top: 0;">Chi tiết tour:</h3>
                                    %s
                                </div>

                                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #856404; margin-top: 0;">Lưu ý quan trọng:</h3>
                                    <ul>
                                        <li>Vui lòng mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)</li>
                                        <li>Mang theo đồ dùng cá nhân cần thiết</li>
                                        <li>Đến đúng điểm hẹn trước giờ khởi hành</li>
                                        <li>Kiểm tra lại hành lý và đồ dùng cá nhân</li>
                                        <li>Chuẩn bị sẵn sàng cho chuyến đi</li>
                                    </ul>
                                </div>

                                <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:</p>
                                <ul>
                                    <li>Hotline: 1900 xxxx</li>
                                    <li>Email: support@traveltour.com</li>
                                </ul>

                                <p>Chúc bạn có một chuyến đi thú vị!</p>
                                <p>Trân trọng,<br>Đội ngũ TravelTour</p>
                            </div>
                        </body>
                        </html>
                        """,
                tourName, startDate, endDate, startDate, tourDetails);

        // Gửi email cho tất cả email duy nhất
        for (String email : uniqueEmails) {
            try {
                sendHtmlEmail(email, subject, content);
            } catch (Exception e) {
                logger.error("Failed to send tour reminder email to: {}. Error: {}", email, e.getMessage());
                // Tiếp tục gửi cho các email khác nếu một email bị lỗi
            }
        }
    }

    public void sendTourItineraryEmail(String to, String userName, String tourName, String startDate,
            String endDate, List<TourItineraryDTO> itineraries) {
        String subject = "Chi tiết lịch trình tour " + tourName;
        StringBuilder itineraryHtml = new StringBuilder();
        int idx = 1;
        for (TourItineraryDTO itinerary : itineraries) {
            itineraryHtml.append("<div style='margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;'>")
                    .append("<h4 style='color: #1976d2; margin-top: 0;'>Ngày ").append(idx).append("</h4>")
                    .append("<p><strong>Tiêu đề:</strong> ").append(itinerary.getTitle()).append("</p>")
                    .append("<p><strong>Loại hoạt động:</strong> ").append(itinerary.getType() != null ? itinerary.getType() : "Không có thông tin").append("</p>")
                    .append("<p><strong>Thời gian:</strong> ").append(itinerary.getStartTime() != null ? itinerary.getStartTime().toString() : "N/A")
                    .append(" - ").append(itinerary.getEndTime() != null ? itinerary.getEndTime().toString() : "N/A").append("</p>")
                    .append("<p><strong>Mô tả:</strong> ").append(itinerary.getDescription() != null ? itinerary.getDescription() : "Không có thông tin").append("</p>")
                    .append("<style>")
                    .append("div { background-color: #f8f9fa; }")
                    .append("h4 { color: #1976d2; }")
                    .append("p { margin: 5px 0; }")
                    .append("</style>")
                    .append("</div>");
            idx++;
        }

        String content = String.format(
                """
                        <html>
                        <head>
                            <meta charset="UTF-8">
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2 style="color: #1976d2;">Xin chào %s,</h2>
                                <p>Tour <strong>%s</strong> của bạn sẽ bắt đầu vào ngày <strong>%s</strong> và kết thúc vào ngày <strong>%s</strong>.</p>

                                <div style="margin: 20px 0;">
                                    <h3 style="color: #17a2b8; margin-bottom: 20px;">Chi tiết lịch trình:</h3>
                                    %s
                                </div>

                                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #856404; margin-top: 0;">Lưu ý quan trọng:</h3>
                                    <ul style="padding-left: 20px;">
                                        <li>Vui lòng đến đúng điểm hẹn trước giờ khởi hành</li>
                                        <li>Mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)</li>
                                        <li>Chuẩn bị đồ dùng cá nhân cần thiết</li>
                                        <li>Tuân thủ các quy định và hướng dẫn của hướng dẫn viên</li>
                                    </ul>
                                </div>

                                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #28a745; margin-top: 0;">Thông tin liên hệ:</h3>
                                    <ul style="padding-left: 20px;">
                                        <li>Hotline: 1900 xxxx</li>
                                        <li>Email: support@traveltour.com</li>
                                    </ul>
                                </div>

                                <p style="margin-top: 20px;">Chúc bạn có một chuyến đi thú vị!</p>
                                <p>Trân trọng,<br>Đội ngũ TravelTour</p>
                            </div>
                        </body>
                        </html>
                        """,
                userName, tourName, startDate, endDate, itineraryHtml.toString());

        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            helper.setFrom("noreply@traveltour.com", "TravelTour");
            emailSender.send(mimeMessage);
            logger.info("Successfully sent HTML email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send HTML email to: {}. Error: {}", to, e.getMessage());
            e.printStackTrace();
        }
    }

    // Method mới để gửi email chi tiết lịch trình cho tất cả passengers
    public void sendTourItineraryEmailToAllPassengers(User user, List<BookingPassenger> passengers,
            String tourName, String startDate, String endDate, List<TourItineraryDTO> itineraries) {
        logger.info("Preparing to send tour itinerary email to all passengers with emails");
        
        // Tạo danh sách email duy nhất
        Set<String> uniqueEmails = new HashSet<>();
        
        // Thêm email của user chính
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            uniqueEmails.add(user.getEmail().trim());
        }
        
        // Thêm email của tất cả passengers có email
        for (BookingPassenger passenger : passengers) {
            if (passenger.getEmail() != null && !passenger.getEmail().trim().isEmpty()) {
                uniqueEmails.add(passenger.getEmail().trim());
            }
        }

        logger.info("Sending tour itinerary email to {} unique email addresses: {}", 
                   uniqueEmails.size(), uniqueEmails);

        String subject = "Chi tiết lịch trình tour " + tourName;
        StringBuilder itineraryHtml = new StringBuilder();
        int idx = 1;
        for (TourItineraryDTO itinerary : itineraries) {
            itineraryHtml.append("<div style='margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;'>")
                    .append("<h4 style='color: #1976d2; margin-top: 0;'>Ngày ").append(idx).append("</h4>")
                    .append("<p><strong>Tiêu đề:</strong> ").append(itinerary.getTitle()).append("</p>")
                    .append("<p><strong>Loại hoạt động:</strong> ").append(itinerary.getType() != null ? itinerary.getType() : "Không có thông tin").append("</p>")
                    .append("<p><strong>Thời gian:</strong> ").append(itinerary.getStartTime() != null ? itinerary.getStartTime().toString() : "N/A")
                    .append(" - ").append(itinerary.getEndTime() != null ? itinerary.getEndTime().toString() : "N/A").append("</p>")
                    .append("<p><strong>Mô tả:</strong> ").append(itinerary.getDescription() != null ? itinerary.getDescription() : "Không có thông tin").append("</p>")
                    .append("<style>")
                    .append("div { background-color: #f8f9fa; }")
                    .append("h4 { color: #1976d2; }")
                    .append("p { margin: 5px 0; }")
                    .append("</style>")
                    .append("</div>");
            idx++;
        }

        String content = String.format(
                """
                        <html>
                        <head>
                            <meta charset="UTF-8">
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2 style="color: #1976d2;">Xin chào,</h2>
                                <p>Tour <strong>%s</strong> sẽ bắt đầu vào ngày <strong>%s</strong> và kết thúc vào ngày <strong>%s</strong>.</p>

                                <div style="margin: 20px 0;">
                                    <h3 style="color: #17a2b8; margin-bottom: 20px;">Chi tiết lịch trình:</h3>
                                    %s
                                </div>

                                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #856404; margin-top: 0;">Lưu ý quan trọng:</h3>
                                    <ul style="padding-left: 20px;">
                                        <li>Vui lòng đến đúng điểm hẹn trước giờ khởi hành</li>
                                        <li>Mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)</li>
                                        <li>Chuẩn bị đồ dùng cá nhân cần thiết</li>
                                        <li>Tuân thủ các quy định và hướng dẫn của hướng dẫn viên</li>
                                    </ul>
                                </div>

                                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3 style="color: #28a745; margin-top: 0;">Thông tin liên hệ:</h3>
                                    <ul style="padding-left: 20px;">
                                        <li>Hotline: 1900 xxxx</li>
                                        <li>Email: support@traveltour.com</li>
                                    </ul>
                                </div>

                                <p style="margin-top: 20px;">Chúc bạn có một chuyến đi thú vị!</p>
                                <p>Trân trọng,<br>Đội ngũ TravelTour</p>
                            </div>
                        </body>
                        </html>
                        """,
                tourName, startDate, endDate, itineraryHtml.toString());

        // Gửi email cho tất cả email duy nhất
        for (String email : uniqueEmails) {
            try {
                sendHtmlEmail(email, subject, content);
            } catch (Exception e) {
                logger.error("Failed to send tour itinerary email to: {}. Error: {}", email, e.getMessage());
                // Tiếp tục gửi cho các email khác nếu một email bị lỗi
            }
        }
    }

    public void sendGuideAssignmentEmail(String to, String guideName, String tourName, String tourDesc,
            String startDate, String endDate, List<Map<String, String>> customers) {
        try {
            StringBuilder customerRows = new StringBuilder();
            for (Map<String, String> c : customers) {
                customerRows.append(String.format("""
                            <tr>
                                <td style='padding: 10px; border-bottom: 1px solid #ddd;'>%s</td>
                                <td style='padding: 10px; border-bottom: 1px solid #ddd;'>%s</td>
                            </tr>
                        """, c.getOrDefault("name", "N/A"), c.getOrDefault("phone", "N/A")));
            }
            String content = String.format(
                    """
                                <html>
                                <head><meta charset='UTF-8'></head>
                                <body style='font-family: Arial, sans-serif; color: #333;'>
                                    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                                        <h2 style='color: #1976d2;'>Xin chào %s,</h2>
                                        <p>Bạn vừa được phân công làm hướng dẫn viên cho tour <b>%s</b>.</p>
                                        <p><b>Mô tả tour:</b> %s</p>
                                        <p><b>Lịch trình:</b> %s - %s</p>
                                        <h3 style='color: #1976d2;'>Danh sách khách hàng</h3>
                                        <table style='width: 100%%; border-collapse: collapse;'>
                                            <tr style='background-color: #f8f9fa;'>
                                                <th style='padding: 10px; text-align: left; border-bottom: 1px solid #ddd;'>Họ và tên</th>
                                                <th style='padding: 10px; text-align: left; border-bottom: 1px solid #ddd;'>Số điện thoại</th>
                                            </tr>
                                            %s
                                        </table>
                                        <div style='margin-top: 30px; color: #666;'>
                                            <p>Chúc bạn có một chuyến đi thành công!</p>
                                            <p>Trân trọng,<br>Đội ngũ TravelTour</p>
                                        </div>
                                    </div>
                                </body>
                                </html>
                            """,
                    guideName, tourName, tourDesc, startDate, endDate, customerRows.toString());
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Phân công hướng dẫn viên cho tour " + tourName);
            helper.setText(content, true);
            helper.setFrom("noreply@traveltour.com", "TravelTour");
            emailSender.send(mimeMessage);
            logger.info("Successfully sent guide assignment email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send guide assignment email to: {}. Error: {}", to, e.getMessage());
        }
    }

    public void sendSimpleEmail(String to, String subject, String content) {
        logger.info("Sending simple email to: {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            emailSender.send(message);
            logger.info("Successfully sent simple email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send simple email to: {}. Error: {}", to, e.getMessage());
        }
    }
}