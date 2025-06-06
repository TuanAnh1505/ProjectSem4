package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.Media;
import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByExperienceId(Long experienceId);
    List<Media> findAll();
}