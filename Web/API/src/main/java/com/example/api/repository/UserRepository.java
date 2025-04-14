package com.example.api.repository;



import com.example.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    int countByIsActive(boolean isActive);
}