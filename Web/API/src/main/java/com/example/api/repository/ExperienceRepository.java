package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.Experience;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    // Lấy danh sách trải nghiệm theo tourId
    List<Experience> findByTour_TourId(Long tourId);

    // Lấy danh sách trải nghiệm theo tourId và status
    List<Experience> findByTour_TourIdAndStatus(Long tourId, String status);

    // Lấy danh sách trải nghiệm theo status
    List<Experience> findByStatus(String status);
}