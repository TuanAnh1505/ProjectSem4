package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Integer notificationId;

    @Column(name = "userid", nullable = false)
    private Long userid;

    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "notification_type", nullable = false)
    private String notificationType;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "related_id")
    private Integer relatedId;

    @Column(name = "schedule_change_request_id")
    private Integer scheduleChangeRequestId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
} 