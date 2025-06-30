package com.example.api.repository;

import com.example.api.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Có thể thêm các phương thức custom nếu cần
} 