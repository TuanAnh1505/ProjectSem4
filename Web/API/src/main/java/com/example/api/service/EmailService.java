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
            helper.setSubject("Kích hoạt tài khoản TravelTour");

            String htmlContent = "<div style='max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:10px;font-family:Segoe UI,Arial,sans-serif;color:#222;'>"
                    +
                    "<h2 style='font-size:2rem;font-weight:700;margin-bottom:18px;'>Xin chào,</h2>" +
                    "<p style='font-size:1.1rem;margin-bottom:10px;'>Cảm ơn bạn đã đăng ký tài khoản tại <b>TravelTour</b>.</p>"
                    +
                    "<p style='font-size:1.1rem;margin-bottom:24px;'>Bạn có thể kích hoạt tài khoản bằng cách nhấn vào nút dưới đây:</p>"
                    +
                    "<div style='margin:32px 0 28px 0;text-align:left;'>" +
                    "<a href='" + webLink
                    + "' style='display:inline-block;padding:12px 28px;background:#2196f3;color:#fff;text-decoration:none;border-radius:8px;font-size:1.1rem;font-weight:600;'>Kích hoạt tài khoản</a>"
                    +
                    "</div>" +
                    "<p style='color:#444;font-size:1rem;margin-bottom:32px;'>Liên kết này sẽ hết hạn sau 24 giờ.</p>" +
                    "<div style='margin-top:40px;color:#444;font-size:1rem;'>" +
                    "Trân trọng,<br>Đội ngũ TravelTour" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true); // true để gửi HTML
            if (isGuide) {
                helper.setSubject("Kích hoạt tài khoản Hướng dẫn viên - TravelTour");
                htmlContent = "<p>Xin chào,</p>"
                        + "<p>Chúc mừng bạn đã được admin tạo tài khoản hướng dẫn viên tại TravelTour.</p>"
                        + "<p>Vui lòng kích hoạt tài khoản để bắt đầu sử dụng các chức năng dành cho hướng dẫn viên.</p>"
                        + "<ul>";
                if (isApp) {
                    htmlContent += "<li><b>Trên app:</b> <a href=\"" + appLink + "\">Kích hoạt tài khoản trên app</a></li>";
                } else {
                    htmlContent += "<li><b>Trên web:</b> <a href=\"" + webLink + "\">Kích hoạt tài khoản trên web</a></li>";
                }
                htmlContent += "</ul>"
                        + "<p>Liên kết này sẽ hết hạn sau 24 giờ.</p>"
                        + "<p>Trân trọng,<br>Đội ngũ TravelTour</p>";
                helper.setText(htmlContent, true);
            } else {
                helper.setSubject("Kích hoạt tài khoản TravelTour");
                htmlContent = "<p>Xin chào,</p>"
                        + "<p>Cảm ơn bạn đã đăng ký tài khoản tại TravelTour.</p>"
                        + "<p>Bạn có thể kích hoạt tài khoản bằng:</p>"
                        + "<ul>";
                if (isApp) {
                    htmlContent += "<li><b>Trên app:</b> <a href=\"" + appLink + "\">Kích hoạt tài khoản trên app</a></li>";
                } else {
                    htmlContent += "<li><b>Trên web:</b> <a href=\"" + webLink + "\">Kích hoạt tài khoản trên web</a></li>";
                }
                htmlContent += "</ul>"
                        + "<p>Liên kết này sẽ hết hạn sau 24 giờ.</p>"
                        + "<p>Trân trọng,<br>Đội ngũ TravelTour</p>";
                helper.setText(htmlContent, true);
            }
            emailSender.send(mimeMessage);
            logger.info("Successfully sent activation email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send activation email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }
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

            String htmlContent = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>"
                    + "<h2 style='color: #007BFF;'>Đặt lại mật khẩu TravelTour</h2>"
                    + "<p>Xin chào,</p>"
                    + "<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>"
                    + "<p>Vui lòng chọn một trong các cách sau để đặt lại mật khẩu:</p>"
                    + "<ul style='list-style: none; padding: 0;'>";
            if (isApp) {
                htmlContent += "<li style='margin-bottom: 15px;'><b>Trên app:</b> <a href='" + appLink
                        + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;'>Đặt lại mật khẩu trên app</a></li>";
            } else {
                htmlContent += "<li style='margin-bottom: 15px;'><b>Trên Web:</b> <a href='" + webLink
                        + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;'>Đặt lại mật khẩu trên web</a></li>";
            }
            htmlContent += "</ul>"
                    + "<p style='color: #dc3545;'><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 30 phút.</p>"
                    + "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>"
                    + "<p>Trân trọng,<br>Đội ngũ TravelTour</p>"
                    + "</div>"
                    + "</body></html>";

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

            String htmlContent = "<p>Xin chào,</p>"
                    + "<p>Chúng tôi nhận được yêu cầu gửi lại email kích hoạt tài khoản TravelTour của bạn.</p>"
                    + "<p>Bạn có thể kích hoạt tài khoản bằng:</p>"
                    + "<ul>";
            if (isApp) {
                htmlContent += "<li><b>Trên app:</b> <a href=\"" + appLink + "\">Kích hoạt tài khoản trên app</a></li>";
            } else {
                htmlContent += "<li><b>Trên web:</b> <a href=\"" + webLink + "\">Kích hoạt tài khoản trên web</a></li>";
            }
            htmlContent += "</ul>"
                    + "<p>Liên kết này sẽ hết hạn sau 24 giờ.</p>"
                    + "<p>Nếu bạn không yêu cầu gửi lại email này, vui lòng bỏ qua.</p>"
                    + "<p>Trân trọng,<br>Đội ngũ TravelTour</p>";

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
        logger.info("Preparing to send payment success email to: {}", user.getEmail());
        try {
            String to = user.getEmail();
            String subject = "Xác nhận thanh toán thành công - Đặt tour " + booking.getBookingId();
            
            // Get schedule information
            var scheduleOpt = tourScheduleRepository.findById(booking.getScheduleId());
            String startDate = "N/A";
            String endDate = "N/A";
            
            if (scheduleOpt.isPresent()) {
                var schedule = scheduleOpt.get();
                startDate = schedule.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                endDate = schedule.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
            
            String content = String.format("""
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
                            <p><strong>Trạng thái:</strong> <span style="color: #28a745;">Đã thanh toán</span></p>
                        </div>

                        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="color: #856404; margin-top: 0;">Danh sách khách hàng</h2>
                            <table style="width: 100%%; border-collapse: collapse;">
                                <tr style="background-color: #f8f9fa;">
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
                generatePassengerTableRows(passengers)
            );

            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            helper.setFrom("noreply@traveltour.com", "TravelTour");
            emailSender.send(mimeMessage);
            logger.info("Successfully sent payment success email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send payment success email to: {}. Error: {}", user.getEmail(), e.getMessage());
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
                passenger.getPhone() != null ? passenger.getPhone() : "N/A"
            ));
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
                                    <h3 style="color: #856404; margin-top: 0;">Chuẩn bị cho chuyến đi:</h3>
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

    public void sendTourItineraryEmail(String to, String userName, String tourName, String startDate, 
            String endDate, List<TourItineraryDTO> itineraries) {
        String subject = "Chi tiết lịch trình tour " + tourName;
        
        // Sort itineraries by itineraryId
        itineraries.sort(Comparator.comparing(TourItineraryDTO::getItineraryId));
        StringBuilder itineraryHtml = new StringBuilder();
        int idx = 0;
        for (TourItineraryDTO itinerary : itineraries) {
            String accordionId = "accordion-" + idx;
            String description = itinerary.getDescription()
                .replace("\"", "&quot;")  // Escape quotes
                .replace("'", "&#39;")    // Escape single quotes
                .replace("<", "&lt;")     // Escape HTML tags
                .replace(">", "&gt;")
                .replace("\n", "<br>");   // Convert newlines to HTML breaks

            String title = itinerary.getTitle()
                .replace("\"", "&quot;")
                .replace("'", "&#39;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");

            itineraryHtml.append(
                "<div style='margin-bottom: 16px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>" +
                "<input type='checkbox' id='" + accordionId + "' style='display:none;'>" +
                "<label for='" + accordionId + "' style='display:block; background:#f8f9fa; padding:15px; cursor:pointer; font-weight:600; color:#1976d2; font-size:18px; margin:0;'>Ngày " + (idx + 1) + ": " + title + "</label>" +
                "<div style='max-height:0; overflow:hidden; transition:max-height 0.3s ease; background:#fff; padding:0 15px;'" +
                " id='content-" + accordionId + "'>" +
                "<div style='color:#666; margin:12px 0 5px 0;'><strong>" +
                (itinerary.getStartTime() != null ? itinerary.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A") +
                " - " +
                (itinerary.getEndTime() != null ? itinerary.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A") +
                "</strong></div>" +
                "<div style='color:#333; white-space: pre-line;'>" + description + "</div>" +
                "</div>" +
                "<style>" +
                "#" + accordionId + ":checked ~ #content-" + accordionId + " { max-height: 1000px !important; padding: 15px !important; }" +
                "#content-" + accordionId + " { max-height:0; overflow:hidden; transition:max-height 0.5s ease; }" +
                "</style>" +
                "</div>"
            );
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

                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
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
}