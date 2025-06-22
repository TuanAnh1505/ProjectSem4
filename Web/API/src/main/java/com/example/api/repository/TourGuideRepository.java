package com.example.api.repository;

import com.example.api.model.TourGuide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourGuideRepository extends JpaRepository<TourGuide, Long> {
    Optional<TourGuide> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
    
    @Query("SELECT tg FROM TourGuide tg WHERE tg.rating >= :minRating")
    List<TourGuide> findByMinRating(@Param("minRating") Double minRating);
    
    @Query("SELECT tg FROM TourGuide tg WHERE tg.experienceYears >= :minExperience")
    List<TourGuide> findByMinExperience(@Param("minExperience") Integer minExperience);
    
    @Query("SELECT tg FROM TourGuide tg WHERE LOWER(tg.specialization) LIKE LOWER(CONCAT('%', :specialization, '%'))")
    List<TourGuide> findBySpecializationContaining(@Param("specialization") String specialization);
    
    @Query("SELECT tg FROM TourGuide tg WHERE LOWER(tg.languages) LIKE LOWER(CONCAT('%', :language, '%'))")
    List<TourGuide> findByLanguageContaining(@Param("language") String language);

    List<TourGuide> findByIsAvailable(Boolean isAvailable);

    @Query("SELECT tg FROM TourGuide tg JOIN tg.user u JOIN u.roles r WHERE r.roleName = 'GUIDE'")
    List<TourGuide> findAllTourGuidesWithRole();
}


