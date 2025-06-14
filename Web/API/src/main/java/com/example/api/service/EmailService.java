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

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

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
            StringBuilder content = new StringBuilder();
            content.append("<h2>Thanh toán thành công!</h2>");
            content.append("<p>Cảm ơn bạn đã đặt tour: <b>").append(booking.getTour().getName()).append("</b></p>");
            content.append("<p><b>Giá tiền:</b> ").append(payment.getAmount()).append(" VND</p>");
            content.append("<p><b>Số lượng khách:</b> ").append(passengers.size()).append("</p>");
            content.append("<h3>Thông tin khách:</h3>");
            for (BookingPassenger p : passengers) {
                content.append("<p>")
                        .append(p.getFullName()).append(" - ")
                        .append(p.getPhone() != null ? p.getPhone() : "")
                        .append("</p>");
            }
            sendHtmlEmail(to, subject, content.toString());
            logger.info("Successfully sent payment success email to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send payment success email to: {}. Error: {}", user.getEmail(), e.getMessage());
            e.printStackTrace();
        }
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
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2 style="color: #1976d2;">Xin chào %s,</h2>
                                <p>Tour <strong>%s</strong> của bạn đã kết thúc vào ngày <strong>%s</strong>.</p>
                                <p>Chúng tôi rất mong nhận được đánh giá của bạn về trải nghiệm tour này.</p>
                                <p>Bạn có thể gửi đánh giá bằng cách:</p>
                                <ol>
                                    <li>Click vào link web: <a href="%s" style="color: #1976d2; text-decoration: none;">Gửi đánh giá qua Web</a></li>
                                    <li>Hoặc mở ứng dụng di động: <a href="%s" style="color: #1976d2; text-decoration: none;">Gửi đánh giá qua App</a></li>
                                </ol>
                                <p>Đánh giá của bạn sẽ giúp chúng tôi cải thiện dịch vụ tốt hơn.</p>
                                <p>Trân trọng,<br>Đội ngũ Travel App</p>
                            </div>
                        </body>
                        </html>
                        """,
                userName, tourName, endDate, webFeedbackLink, appFeedbackLink);
        sendHtmlEmail(to, subject, content);
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
        
        StringBuilder itineraryHtml = new StringBuilder();
        for (TourItineraryDTO itinerary : itineraries) {
            itineraryHtml.append("<div style='margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;'>")
                    .append("<h3 style='color: #1976d2; margin-top: 0;'>").append(itinerary.getTitle()).append("</h3>")
                    .append("<p><strong>Thời gian:</strong> ")
                    .append(itinerary.getStartTime() != null ? itinerary.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A")
                    .append(" - ")
                    .append(itinerary.getEndTime() != null ? itinerary.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A")
                    .append("</p>")
                    .append("<p><strong>Loại hoạt động:</strong> ").append(itinerary.getType()).append("</p>")
                    .append("<p><strong>Mô tả:</strong> ").append(itinerary.getDescription()).append("</p>")
                    .append("</div>");
        }

        String content = String.format(
                """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #1976d2;">Xin chào %s,</h2>
                        <p>Tour <strong>%s</strong> của bạn sẽ bắt đầu vào ngày <strong>%s</strong> và kết thúc vào ngày <strong>%s</strong>.</p>
                        
                        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #17a2b8; margin-top: 0;">Chi tiết lịch trình:</h3>
                            %s
                        </div>

                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #856404; margin-top: 0;">Lưu ý quan trọng:</h3>
                            <ul>
                                <li>Vui lòng đến đúng điểm hẹn trước giờ khởi hành</li>
                                <li>Mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)</li>
                                <li>Chuẩn bị đồ dùng cá nhân cần thiết</li>
                                <li>Tuân thủ các quy định và hướng dẫn của hướng dẫn viên</li>
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
                userName, tourName, startDate, endDate, itineraryHtml.toString());
        
        sendHtmlEmail(to, subject, content);
    }
}
