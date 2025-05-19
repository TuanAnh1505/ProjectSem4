package com.example.api.repository;

import com.example.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    Optional<User> findByPublicId(String publicId);

    int countByIsActive(boolean isActive);

    
}


