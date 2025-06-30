package com.example.api.service;

import com.example.api.model.Notification;
import com.example.api.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification createNotification(Long userId, Long senderId, String title, String message, String type, Integer scheduleChangeRequestId) {
        Notification notification = new Notification();
        notification.setUserid(userId);
        notification.setSenderId(senderId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setIsRead(false);
        notification.setRelatedId(scheduleChangeRequestId);
        notification.setScheduleChangeRequestId(scheduleChangeRequestId);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
} 