package com.example.api.service;

import com.example.api.dto.GuideReviewDTO;
import com.example.api.model.GuideReview;
import com.example.api.model.TourGuide;
import com.example.api.model.User;
import com.example.api.repository.GuideReviewRepository;
import com.example.api.repository.TourGuideRepository;
import com.example.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GuideReviewService {
    
    @Autowired
    private GuideReviewRepository guideReviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourGuideRepository tourGuideRepository;

    public List<GuideReviewDTO> getAllReviews() {
        return guideReviewRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    

    public GuideReviewDTO getReviewById(Integer reviewId) {
        return guideReviewRepository.findById(reviewId)
            .map(this::convertToDTO)
            .orElse(null);
    }
    

    public List<GuideReviewDTO> getReviewsByGuideId(Integer guideId) {
        List<GuideReview> reviews = guideReviewRepository.findByGuideGuideId(guideId);
        return reviews.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<GuideReviewDTO> getReviewsByUserId(Long userId) {
        List<GuideReview> reviews = guideReviewRepository.findByUserUserid(userId);
        return reviews.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<GuideReviewDTO> getReviewsByGuideIdAndMinRating(Integer guideId, Integer minRating) {
        List<GuideReview> reviews = guideReviewRepository.findByGuideIdAndMinRating(guideId, minRating);
        return reviews.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public GuideReviewDTO createReview(GuideReviewDTO reviewDTO) {
        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        TourGuide guide = tourGuideRepository.findById(reviewDTO.getGuideId().longValue())
                .orElseThrow(() -> new IllegalStateException("Guide not found"));

        if (guideReviewRepository.existsByUserUseridAndGuideGuideId(reviewDTO.getUserId(), reviewDTO.getGuideId())) {
            throw new IllegalStateException("User has already reviewed this guide");
        }

        GuideReview review = new GuideReview();
        review.setUser(user);
        review.setGuide(guide);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        GuideReview savedReview = guideReviewRepository.save(review);

        // Update guide's average rating
        Double averageRating = guideReviewRepository.getAverageRatingByGuideId(guide.getGuideId().intValue());
        guide.setRating(averageRating);
        tourGuideRepository.save(guide);

        return convertToDTO(savedReview);
    }
    
    /**
     * Cập nhật đánh giá
     */
    @Transactional
    public GuideReviewDTO updateReview(Integer reviewId, Integer rating, String comment) {
        GuideReview review = guideReviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));
            
        review.setRating(rating);
        review.setComment(comment);
        
        return convertToDTO(guideReviewRepository.save(review));
    }
    
    /**
     * Xóa đánh giá
     */
    @Transactional
    public void deleteReview(Integer reviewId) {
        if (!guideReviewRepository.existsById(reviewId)) {
            throw new EntityNotFoundException("Review not found with id: " + reviewId);
        }
        
        GuideReview review = guideReviewRepository.findById(reviewId).get();
        Integer guideId = review.getGuide().getGuideId().intValue();
        
        guideReviewRepository.deleteById(reviewId);
        
        // Update guide's average rating after deletion
        Double newAverageRating = guideReviewRepository.getAverageRatingByGuideId(guideId);
        TourGuide guide = review.getGuide();
        guide.setRating(newAverageRating != null ? newAverageRating : 0.0);
        tourGuideRepository.save(guide);
    }
    
    /**
     * Chuyển đổi từ entity sang DTO
     */
    private GuideReviewDTO convertToDTO(GuideReview review) {
        if (review == null) return null;
        
        GuideReviewDTO dto = new GuideReviewDTO();
        dto.setGuideReviewId(review.getGuideReviewId());
        dto.setUserId(review.getUser().getUserid());
        dto.setGuideId(review.getGuide().getGuideId().intValue());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        // Set additional response fields
        dto.setUserName(review.getUser().getFullName());
        dto.setGuideName(review.getGuide().getUser().getFullName());
        dto.setGuideSpecialization(review.getGuide().getSpecialization());
        dto.setGuideLanguages(review.getGuide().getLanguages());
        dto.setGuideRating(review.getGuide().getRating());

        return dto;
    }
} 