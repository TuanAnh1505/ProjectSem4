package com.example.api.repository;

import com.example.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByPublicId(String publicId);

    int countByIsActive(boolean isActive);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = 'ROLE_TOUR_GUIDE' AND (u.fullName LIKE %:search% OR u.email LIKE %:search%)")
    Page<User> searchTourGuideUsers(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = 'ADMIN'")
    List<User> findAdmins();
}


