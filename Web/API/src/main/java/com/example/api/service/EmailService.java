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

            String htmlContent = "<p>Xin chào,</p>"
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

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
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

    public void sendFeedbackRequestEmail(String to, String userName, String tourName, String endDate, String feedbackLink) {
        try {
            String subject = "Mời bạn đánh giá trải nghiệm tour - TravelTour";
            String htmlContent = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #fafcff;'>"
                    + "<h2 style='color: #007BFF;'>Cảm ơn bạn đã đồng hành cùng TravelTour!</h2>"
                    + "<p>Xin chào <b>" + userName + "</b>,</p>"
                    + "<p>Bạn vừa hoàn thành tour: <b>" + tourName + "</b></p>"
                    + "<p><b>Ngày kết thúc:</b> " + endDate + "</p>"
                    + "<p>Chúng tôi rất mong nhận được đánh giá của bạn để cải thiện dịch vụ.</p>"
                    + "<div style='margin: 24px 0;'>"
                    + "<a href='" + feedbackLink + "' style='display: inline-block; padding: 12px 28px; background: #007BFF; color: #fff; border-radius: 5px; text-decoration: none; font-size: 16px;'>Gửi feedback ngay</a>"
                    + "</div>"
                    + "<p style='color: #888;'>Nếu nút không hoạt động, hãy copy link sau vào trình duyệt:<br><a href='" + feedbackLink + "'>" + feedbackLink + "</a></p>"
                    + "<p>Trân trọng,<br>Đội ngũ TravelTour</p>"
                    + "</div></body></html>";
            sendHtmlEmail(to, subject, htmlContent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
