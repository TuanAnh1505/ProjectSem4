package com.example.api.repository;

import com.example.api.model.UserToken;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface UserTokenRepository extends JpaRepository<UserToken, Integer> {
    UserToken findByToken(String token);
    @Transactional
    @Modifying
    void deleteAllByExpiryBefore(LocalDateTime now);
}


