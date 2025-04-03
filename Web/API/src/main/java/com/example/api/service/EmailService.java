package com.example.api.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(String to, Long userId) {
        String activationLink = "http://localhost:8080/api/auth/activate?userId=" + userId;
        jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Kích hoạt tài khoản");
            String htmlContent = "<html><body>" +
                    "<p>Vui lòng kích hoạt tài khoản của bạn bằng cách nhấp vào nút bên dưới:</p>" +
                    "<a href=\"" + activationLink + "\" style=\"display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;\">Kích hoạt tài khoản</a>" +
                    "</body></html>";
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }
}
