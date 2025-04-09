package com.example.api.repository;

import com.example.api.model.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken, Integer> {
    UserToken findByToken(String token);
}