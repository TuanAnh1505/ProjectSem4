package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.Experience;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    // Lấy danh sách trải nghiệm theo tourId
    List<Experience> findByTourId(Long tourId);

    // Lấy danh sách trải nghiệm theo tourId và status
    List<Experience> findByTourIdAndStatus(Long tourId, String status);

    // Lấy danh sách trải nghiệm theo status
    List<Experience> findByStatus(String status);
}