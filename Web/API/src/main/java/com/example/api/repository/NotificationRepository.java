package com.example.api.repository;

import com.example.api.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUseridOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUseridAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    long countByUseridAndIsReadFalse(Long userId);
    List<Notification> findByUseridAndIsReadFalse(Long userId);
} 