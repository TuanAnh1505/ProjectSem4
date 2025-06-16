package com.example.api.repository;

import com.example.api.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
} 