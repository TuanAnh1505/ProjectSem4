package com.example.api.service;

import com.example.api.dto.ScheduleChangeRequestDTO;
import com.example.api.model.*;
import com.example.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleChangeRequestService {
    private static final Logger logger = LoggerFactory.getLogger(ScheduleChangeRequestService.class);
    
    private final ScheduleChangeRequestRepository scheduleChangeRequestRepository;
    private final TourGuideRepository tourGuideRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final TourItineraryRepository tourItineraryRepository;

    @Transactional
    public ScheduleChangeRequestDTO createRequest(ScheduleChangeRequestDTO dto) {
        logger.info("Creating schedule change request for schedule: {}", dto.getScheduleId());
        
        ScheduleChangeRequest request = new ScheduleChangeRequest();
        request.setScheduleId(dto.getScheduleId());
        request.setGuideId(dto.getGuideId());
        request.setRequestType(ScheduleChangeRequest.RequestType.valueOf(dto.getRequestType()));
        request.setCurrentItineraryId(dto.getCurrentItineraryId());
        request.setProposedChanges(dto.getProposedChanges());
        request.setReason(dto.getReason());
        request.setUrgencyLevel(ScheduleChangeRequest.UrgencyLevel.valueOf(dto.getUrgencyLevel()));
        request.setEffectiveDate(dto.getEffectiveDate());
        
        ScheduleChangeRequest savedRequest = scheduleChangeRequestRepository.save(request);
        
        // Gửi thông báo cho admin
        notifyAdmins(savedRequest);
        
        return convertToDTO(savedRequest);
    }

    public List<ScheduleChangeRequestDTO> getRequestsByGuide(Integer guideId) {
        logger.info("Fetching schedule change requests for guide: {}", guideId);
        
        return scheduleChangeRequestRepository.findByGuideIdOrderByRequestedAtDesc(guideId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ScheduleChangeRequestDTO> getPendingRequests() {
        logger.info("Fetching all pending schedule change requests");
        
        return scheduleChangeRequestRepository.findByStatusOrderByUrgencyLevelDescRequestedAtAsc(
                ScheduleChangeRequest.Status.pending)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ScheduleChangeRequestDTO> getAllRequests() {
        logger.info("Fetching all schedule change requests");
        
        return scheduleChangeRequestRepository.findAllByOrderByRequestedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduleChangeRequestDTO approveRequest(Integer requestId, String adminResponse, Long adminId) {
        logger.info("Approving schedule change request: {}", requestId);
        
        ScheduleChangeRequest request = scheduleChangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Schedule change request not found"));
        
        request.setStatus(ScheduleChangeRequest.Status.approved);
        request.setAdminResponse(adminResponse);
        request.setAdminId(adminId);
        request.setRespondedAt(LocalDateTime.now());
        
        // Tự động cập nhật itinerary nếu là yêu cầu thay đổi itinerary
        if (request.getRequestType() == ScheduleChangeRequest.RequestType.itinerary_change
            && request.getCurrentItineraryId() != null) {
            TourItinerary itinerary = tourItineraryRepository.findById(request.getCurrentItineraryId())
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));
            itinerary.setDescription(request.getProposedChanges());
            tourItineraryRepository.save(itinerary);
        }
        
        ScheduleChangeRequest savedRequest = scheduleChangeRequestRepository.save(request);
        
        // Gửi thông báo cho guide
        notifyGuide(savedRequest, "approved");
        
        return convertToDTO(savedRequest);
    }

    @Transactional
    public ScheduleChangeRequestDTO rejectRequest(Integer requestId, String adminResponse, Long adminId) {
        logger.info("Rejecting schedule change request: {}", requestId);
        
        ScheduleChangeRequest request = scheduleChangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Schedule change request not found"));
        
        request.setStatus(ScheduleChangeRequest.Status.rejected);
        request.setAdminResponse(adminResponse);
        request.setAdminId(adminId);
        request.setRespondedAt(LocalDateTime.now());
        
        ScheduleChangeRequest savedRequest = scheduleChangeRequestRepository.save(request);
        
        // Gửi thông báo cho guide
        notifyGuide(savedRequest, "rejected");
        
        return convertToDTO(savedRequest);
    }

    private void notifyAdmins(ScheduleChangeRequest request) {
        try {
            // Lấy thông tin guide và schedule
            TourGuide guide = tourGuideRepository.findById(request.getGuideId().longValue())
                    .orElseThrow(() -> new RuntimeException("Guide not found"));
            
            TourSchedule schedule = tourScheduleRepository.findById(request.getScheduleId())
                    .orElseThrow(() -> new RuntimeException("Schedule not found"));
            
            // Gửi thông báo cho tất cả admin
            List<User> admins = userRepository.findAdmins();
            for (User admin : admins) {
                notificationService.createNotification(
                    admin.getUserid(),
                    null,
                    "Yêu cầu thay đổi lịch trình mới",
                    String.format("Guide %s đã yêu cầu thay đổi lịch trình cho tour (Schedule ID: %d). Mức độ khẩn cấp: %s", 
                        guide.getUser().getFullName(), request.getScheduleId(), request.getUrgencyLevel()),
                    "schedule_change",
                    request.getRequestId()
                );
            }
            
            // Gửi email cho admin
            String subject = String.format("[TravelTour] Yêu cầu thay đổi lịch trình - %s", request.getUrgencyLevel().name().toUpperCase());
            String content = String.format(
                "Guide %s đã yêu cầu thay đổi lịch trình cho tour.\n" +
                "Schedule ID: %d\n" +
                "Loại yêu cầu: %s\n" +
                "Lý do: %s\n" +
                "Thay đổi đề xuất: %s\n" +
                "Mức độ khẩn cấp: %s",
                guide.getUser().getFullName(),
                request.getScheduleId(),
                request.getRequestType(),
                request.getReason(),
                request.getProposedChanges(),
                request.getUrgencyLevel()
            );
            
            for (User admin : admins) {
                emailService.sendSimpleEmail(admin.getEmail(), subject, content);
            }
            
        } catch (Exception e) {
            logger.error("Error notifying admins about schedule change request: {}", e.getMessage());
        }
    }

    private void notifyGuide(ScheduleChangeRequest request, String action) {
        try {
            TourGuide guide = tourGuideRepository.findById(request.getGuideId().longValue())
                    .orElseThrow(() -> new RuntimeException("Guide not found"));
            
            String title = action.equals("approved") ? 
                "Yêu cầu thay đổi lịch trình đã được phê duyệt" :
                "Yêu cầu thay đổi lịch trình đã bị từ chối";
            
            String message = String.format("Yêu cầu thay đổi lịch trình của bạn (Request ID: %d) đã được %s. %s", 
                request.getRequestId(), 
                action.equals("approved") ? "phê duyệt" : "từ chối",
                request.getAdminResponse() != null ? "Phản hồi: " + request.getAdminResponse() : "");
            
            notificationService.createNotification(
                guide.getUser().getUserid(),
                request.getAdminId(),
                title,
                message,
                "schedule_change",
                request.getRequestId()
            );
            
            // Gửi email cho guide
            String subject = String.format("[TravelTour] %s", title);
            emailService.sendSimpleEmail(guide.getUser().getEmail(), subject, message);
            
        } catch (Exception e) {
            logger.error("Error notifying guide about schedule change request response: {}", e.getMessage());
        }
    }

    private ScheduleChangeRequestDTO convertToDTO(ScheduleChangeRequest request) {
        ScheduleChangeRequestDTO dto = new ScheduleChangeRequestDTO();
        dto.setRequestId(request.getRequestId());
        dto.setScheduleId(request.getScheduleId());
        dto.setGuideId(request.getGuideId().intValue());
        dto.setRequestType(request.getRequestType().name());
        dto.setCurrentItineraryId(request.getCurrentItineraryId());
        dto.setProposedChanges(request.getProposedChanges());
        dto.setReason(request.getReason());
        dto.setUrgencyLevel(request.getUrgencyLevel().name());
        dto.setStatus(request.getStatus().name());
        dto.setAdminResponse(request.getAdminResponse());
        dto.setAdminId(request.getAdminId());
        dto.setRequestedAt(request.getRequestedAt());
        dto.setRespondedAt(request.getRespondedAt());
        dto.setEffectiveDate(request.getEffectiveDate());
        
        // Thêm thông tin bổ sung
        try {
            TourGuide guide = tourGuideRepository.findById(request.getGuideId().longValue()).orElse(null);
            if (guide != null) {
                dto.setGuideName(guide.getUser().getFullName());
            }
            
            TourSchedule schedule = tourScheduleRepository.findById(request.getScheduleId()).orElse(null);
            if (schedule != null) {
                dto.setScheduleStartDate(schedule.getStartDate());
                dto.setScheduleEndDate(schedule.getEndDate());
            }
            
            if (request.getAdminId() != null) {
                User admin = userRepository.findById(request.getAdminId()).orElse(null);
                if (admin != null) {
                    dto.setAdminName(admin.getFullName());
                }
            }
        } catch (Exception e) {
            logger.warn("Error loading additional information for request {}: {}", request.getRequestId(), e.getMessage());
        }
        
        return dto;
    }
} 