package com.example.api.service;

import com.example.api.model.Booking;
import com.example.api.model.BookingPassenger;
import com.example.api.model.Payment;
import com.example.api.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendActivationEmail(String to, String publicId, boolean isApp) {
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
            emailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String publicId, boolean isApp) {
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
        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    public void sendDiscountCodeEmail(String to, String code, String description) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã giảm giá đặc biệt từ TravelTour");
        message.setText("Xin chào,\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản tại TravelTour. " +
                "Chúng tôi gửi tặng bạn mã giảm giá đặc biệt:\n\n" +
                "Mã giảm giá: " + code + "\n" +
                "Mô tả: " + description + "\n\n" +
                "Hãy sử dụng mã này trong lần đặt tour đầu tiên của bạn!\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ TravelTour");
        emailSender.send(message);
    }

    public void resendActivationEmail(String to, String publicId, boolean isApp) {
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
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gửi lại email kích hoạt thất bại: " + e.getMessage());
        }
    }

    public void sendPaymentSuccessEmail(User user, Booking booking, Payment payment,
            List<BookingPassenger> passengers) {
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
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
