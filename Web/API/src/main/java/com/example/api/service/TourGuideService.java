package com.example.api.service;

import com.example.api.dto.TourGuideDTO;
import com.example.api.model.TourGuide;
import com.example.api.model.User;
import com.example.api.repository.TourGuideRepository;
import com.example.api.repository.UserRepository;
import com.example.api.repository.RoleRepository;
import com.example.api.model.Role;
import com.example.api.repository.UserRoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TourGuideService {

    @Autowired
    private TourGuideRepository tourGuideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    public TourGuideDTO createTourGuide(TourGuideDTO tourGuideDTO) {
        // Check if current user has ADMIN role
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
        
        boolean isAdmin = currentUser.getRoles().stream()
            .anyMatch(role -> role.getRoleName().equals("ADMIN"));
            
        if (!isAdmin) {
            throw new AccessDeniedException("Only administrators can create tour guides");
        }

        // Check if user exists
        User user = userRepository.findById(tourGuideDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + tourGuideDTO.getUserId()));

        // Check if user is already a tour guide
        if (tourGuideRepository.existsByUserId(tourGuideDTO.getUserId())) {
            throw new IllegalStateException("User is already a tour guide");
        }

        TourGuide tourGuide = new TourGuide();
        tourGuide.setUserId(tourGuideDTO.getUserId());
        tourGuide.setExperienceYears(tourGuideDTO.getExperienceYears());
        tourGuide.setSpecialization(tourGuideDTO.getSpecialization());
        tourGuide.setLanguages(tourGuideDTO.getLanguages());
        tourGuide.setRating(tourGuideDTO.getRating() != null ? tourGuideDTO.getRating() : 0.0);
        tourGuide.setIsAvailable(tourGuideDTO.getIsAvailable() != null ? tourGuideDTO.getIsAvailable() : true);

        TourGuide savedTourGuide = tourGuideRepository.save(tourGuide);

        // Gán role hướng dẫn viên nếu chưa có
        Role guideRole = roleRepository.findByRoleName("GUIDE");
        if (guideRole != null && user.getRoles().stream().noneMatch(r -> r.getRoleName().equalsIgnoreCase("GUIDE"))) {
            user.getRoles().add(guideRole);
            userRepository.save(user);
            // Bổ sung: luôn lưu vào userroles
            userRoleRepository.save(new com.example.api.model.UserRole(user.getUserid(), guideRole.getRoleid()));
        }

        return convertToDTO(savedTourGuide);
    }

    public TourGuideDTO getTourGuideById(Long id) {
        TourGuide tourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + id));
        return convertToDTO(tourGuide);
    }

    public List<TourGuideDTO> getAllTourGuides() {
        // Lấy tất cả user có role là GUIDE
        List<User> guideUsers = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getRoleName().equalsIgnoreCase("GUIDE")))
                .collect(Collectors.toList());

        // Chuyển đổi sang DTO
        return guideUsers.stream().map(user -> {
            Optional<TourGuide> tourGuideOpt = tourGuideRepository.findByUserId(user.getUserid());
            if (tourGuideOpt.isPresent()) {
                // Nếu có hồ sơ guide, dùng convertToDTO hiện có
                return convertToDTO(tourGuideOpt.get());
            } else {
                // Nếu chưa có hồ sơ, tạo DTO từ thông tin User
                TourGuideDTO dto = new TourGuideDTO();
                dto.setUserId(user.getUserid());
                dto.setUserFullName(user.getFullName());
                dto.setUserEmail(user.getEmail());
                dto.setIsAvailable(user.getIsActive()); // Dùng trạng thái active của user
                dto.setIsActive(user.getIsActive());
                
                // Đánh dấu là chưa có hồ sơ guide
                dto.setGuideId(0L); // Dùng 0L để đánh dấu chưa có guideId
                dto.setSpecialization("Chưa có hồ sơ");

                return dto;
            }
        }).collect(Collectors.toList());
    }

    public TourGuideDTO updateTourGuide(Long id, TourGuideDTO tourGuideDTO) {
        // Check if current user has ADMIN role
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
        
        boolean isAdmin = currentUser.getRoles().stream()
            .anyMatch(role -> role.getRoleName().equals("ADMIN"));
            
        if (!isAdmin) {
            throw new AccessDeniedException("Only administrators can update tour guides");
        }

        TourGuide tourGuide = tourGuideRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + id));

        // Update fields
        if (tourGuideDTO.getExperienceYears() != null) {
            tourGuide.setExperienceYears(tourGuideDTO.getExperienceYears());
        }
        if (tourGuideDTO.getSpecialization() != null) {
            tourGuide.setSpecialization(tourGuideDTO.getSpecialization());
        }
        if (tourGuideDTO.getLanguages() != null) {
            tourGuide.setLanguages(tourGuideDTO.getLanguages());
        }
        if (tourGuideDTO.getRating() != null) {
            tourGuide.setRating(tourGuideDTO.getRating());
        }
        if (tourGuideDTO.getIsAvailable() != null) {
            tourGuide.setIsAvailable(tourGuideDTO.getIsAvailable());
        }

        TourGuide updatedTourGuide = tourGuideRepository.save(tourGuide);
        return convertToDTO(updatedTourGuide);
    }

    public void deleteTourGuide(Long id) {
        // Check if current user has ADMIN role
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
        
        boolean isAdmin = currentUser.getRoles().stream()
            .anyMatch(role -> role.getRoleName().equals("ADMIN"));
            
        if (!isAdmin) {
            throw new AccessDeniedException("Only administrators can delete tour guides");
        }

        if (!tourGuideRepository.existsById(id)) {
            throw new EntityNotFoundException("Tour guide not found with id: " + id);
        }
        tourGuideRepository.deleteById(id);
    }

    public List<TourGuideDTO> findByMinRating(Double minRating) {
        return tourGuideRepository.findByMinRating(minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findByMinExperience(Integer minExperience) {
        return tourGuideRepository.findByMinExperience(minExperience).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findBySpecialization(String specialization) {
        return tourGuideRepository.findBySpecializationContaining(specialization).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findByLanguage(String language) {
        return tourGuideRepository.findByLanguageContaining(language).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> findByIsAvailable(Boolean isAvailable) {
        return tourGuideRepository.findByIsAvailable(isAvailable).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideDTO> searchTourGuides(Double minRating, Integer minExperience, String specialization, String language, Boolean isAvailable) {
        List<TourGuide> tourGuides = tourGuideRepository.findAll();
        return tourGuides.stream()
                .filter(tg -> (minRating == null || tg.getRating() >= minRating))
                .filter(tg -> (minExperience == null || tg.getExperienceYears() >= minExperience))
                .filter(tg -> (specialization == null || tg.getSpecialization().equals(specialization)))
                .filter(tg -> (language == null || tg.getLanguages().contains(language)))
                .filter(tg -> (isAvailable == null || tg.getIsAvailable() == isAvailable))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TourGuideDTO createTourGuideForUser(Long userId, Integer experienceYears, String specialization, String languages) {
        TourGuide guide = new TourGuide();
        guide.setUserId(userId);
        guide.setExperienceYears(experienceYears);
        guide.setSpecialization(specialization);
        guide.setLanguages(languages);
        guide.setIsAvailable(true);
        guide.setRating(0.0);
        guide.setCreatedAt(LocalDateTime.now());
        guide = tourGuideRepository.save(guide);
        return convertToDTO(guide);
    }

    public TourGuideDTO getCurrentGuideDetails() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found for email: " + currentUserEmail));

        TourGuide tourGuide = tourGuideRepository.findByUserId(currentUser.getUserid())
                .orElseThrow(() -> new EntityNotFoundException("Tour guide profile not found for user ID: " + currentUser.getUserid()));

        return convertToDTO(tourGuide);
    }

    private TourGuideDTO convertToDTO(TourGuide tourGuide) {
        TourGuideDTO dto = new TourGuideDTO();
        dto.setGuideId(tourGuide.getGuideId());
        dto.setUserId(tourGuide.getUserId());
        dto.setExperienceYears(tourGuide.getExperienceYears());
        dto.setSpecialization(tourGuide.getSpecialization());
        dto.setLanguages(tourGuide.getLanguages());
        dto.setRating(tourGuide.getRating());
        dto.setIsAvailable(tourGuide.getIsAvailable() != null ? tourGuide.getIsAvailable() : true);
        dto.setCreatedAt(tourGuide.getCreatedAt());
        if (tourGuide.getUser() != null) {
            dto.setUserFullName(tourGuide.getUser().getFullName());
            dto.setUserEmail(tourGuide.getUser().getEmail());
            dto.setIsActive(tourGuide.getUser().getIsActive());
        }
        return dto;
    }
}
