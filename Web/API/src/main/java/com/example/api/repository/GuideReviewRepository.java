package com.example.api.repository;

import com.example.api.model.GuideReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GuideReviewRepository extends JpaRepository<GuideReview, Integer> {
    List<GuideReview> findByGuideGuideId(Integer guideId);
    List<GuideReview> findByUserUserid(Long userId);
    
    @Query("SELECT gr FROM GuideReview gr WHERE gr.guide.guideId = :guideId AND gr.rating >= :minRating")
    List<GuideReview> findByGuideIdAndMinRating(
            @Param("guideId") Integer guideId,
            @Param("minRating") Integer minRating);
            
    @Query("SELECT AVG(gr.rating) FROM GuideReview gr WHERE gr.guide.guideId = :guideId")
    Double getAverageRatingByGuideId(@Param("guideId") Integer guideId);
    
    boolean existsByUserUseridAndGuideGuideId(Long userId, Integer guideId);
} 