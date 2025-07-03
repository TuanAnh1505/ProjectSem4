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
    private final BookingRepository bookingRepository;

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
        
      
        if (request.getRequestType() == ScheduleChangeRequest.RequestType.itinerary_change
            && request.getCurrentItineraryId() != null) {
            TourItinerary itinerary = tourItineraryRepository.findById(request.getCurrentItineraryId())
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));
            itinerary.setDescription(request.getProposedChanges());
            tourItineraryRepository.save(itinerary);
        }
        
        ScheduleChangeRequest savedRequest = scheduleChangeRequestRepository.save(request);
        
       
        notifyGuide(savedRequest, "approved");
        
       
        sendNewItineraryToCustomers(savedRequest);
        
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
        
      
        notifyGuide(savedRequest, "rejected");
        
        return convertToDTO(savedRequest);
    }

    private void notifyAdmins(ScheduleChangeRequest request) {
        try {
           
            TourGuide guide = tourGuideRepository.findById(request.getGuideId().longValue())
                    .orElseThrow(() -> new RuntimeException("Guide not found"));
            
            TourSchedule schedule = tourScheduleRepository.findById(request.getScheduleId())
                    .orElseThrow(() -> new RuntimeException("Schedule not found"));
            
           
            List<User> admins = userRepository.findAdmins();
            for (User admin : admins) {
                notificationService.createNotification(
                    admin.getUserid(),
                    guide.getUser().getUserid(),
                    "Yêu cầu thay đổi lịch trình mới",
                    String.format("Guide %s đã yêu cầu thay đổi lịch trình cho tour (Schedule ID: %d). Mức độ khẩn cấp: %s", 
                        guide.getUser().getFullName(), request.getScheduleId(), request.getUrgencyLevel()),
                    "schedule_change",
                    request.getRequestId()
                );
            }
            
            
            String proposedChangesHtml = request.getProposedChanges() != null
                ? request.getProposedChanges().replaceAll("(\r\n|\n)", "<br>")
                : "";
            String reasonHtml = request.getReason() != null
                ? request.getReason().replaceAll("(\r\n|\n)", "<br>")
                : "";

            String subject = String.format("[TravelTour] Yêu cầu thay đổi lịch trình - %s", request.getUrgencyLevel().name().toUpperCase());
            String content = String.format(
                "<div style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>"
              + "<div style='max-width: 520px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px 28px;'>"
              + "<h2 style='color: #2563eb; margin-bottom: 18px;'>Yêu cầu thay đổi lịch trình mới</h2>"
              + "<div style='margin-bottom: 12px;'><b>Guide:</b> %s</div>"
              + "<div style='margin-bottom: 12px;'><b>Schedule ID:</b> %d</div>"
              + "<div style='margin-bottom: 12px;'><b>Loại yêu cầu:</b> %s</div>"
              + "<div style='margin-bottom: 12px;'><b>Lý do:</b><div style='background:#f8fafc; border-radius:6px; padding:8px 12px; margin-top:4px;'>%s</div></div>"
              + "<div style='margin-bottom: 12px;'><b>Thay đổi đề xuất:</b><div style='background:#e0f2fe; border-radius:6px; padding:8px 12px; margin-top:4px;'>%s</div></div>"
              + "<div style='margin-bottom: 12px;'><b>Mức độ khẩn cấp:</b> <span style='color: #d97706;'>%s</span></div>"
              + "<div style='font-size: 15px; color: #374151; margin-top: 18px;'>Vui lòng đăng nhập hệ thống để xem chi tiết và xử lý yêu cầu này.</div>"
              + "<div style='margin-top: 28px; text-align: center;'>"
              + "<a href='http://localhost:3000/admin/schedule-change-request' style='display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;'>Truy cập hệ thống</a>"
              + "</div>"
              + "</div>"
              + "<div style='text-align: center; color: #94a3b8; font-size: 13px; margin-top: 24px;'>TravelTour &copy; 2024</div>"
              + "</div>",
                guide.getUser().getFullName(),
                request.getScheduleId(),
                request.getRequestType(),
                reasonHtml,
                proposedChangesHtml,
                request.getUrgencyLevel()
            );
            for (User admin : admins) {
                emailService.sendHtmlEmail(admin.getEmail(), subject, content);
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
            
            String adminResponseHtml = request.getAdminResponse() != null
                ? request.getAdminResponse().replaceAll("(\r\n|\n)", "<br>")
                : "";
            
            String htmlMessage = String.format(
                "<div style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>"
              + "<div style='max-width: 520px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px 28px;'>"
              + "<h2 style='color: #2563eb; margin-bottom: 18px;'>%s</h2>"
              + "<div style='margin-bottom: 12px;'>Yêu cầu thay đổi lịch trình của bạn (<b>Request ID: %d</b>) đã được <b>%s</b>.</div>"
              + (request.getAdminResponse() != null ? "<div style='margin-bottom: 12px;'><b>Phản hồi admin:</b><div style='background:#f8fafc; border-radius:6px; padding:8px 12px; margin-top:4px;'>" + adminResponseHtml + "</div></div>" : "")
              + "<div style='font-size: 15px; color: #374151; margin-top: 18px;'>Vui lòng đăng nhập hệ thống để xem chi tiết.</div>"
              + "</div>"
              + "<div style='text-align: center; color: #94a3b8; font-size: 13px; margin-top: 24px;'>TravelTour &copy; 2024</div>"
              + "</div>",
                title,
                request.getRequestId(),
                action.equals("approved") ? "phê duyệt" : "từ chối"
            );
            
            String notificationMessage = String.format(
                "Yêu cầu thay đổi lịch trình của bạn (Request ID: %d) đã được %s. %s",
                request.getRequestId(),
                action.equals("approved") ? "phê duyệt" : "từ chối",
                request.getAdminResponse() != null ? "Phản hồi: " + request.getAdminResponse() : ""
            );
            
            notificationService.createNotification(
                guide.getUser().getUserid(),
                request.getAdminId(),
                title,
                notificationMessage,
                "schedule_change",
                request.getRequestId()
            );
            
          
            String subject = String.format("[TravelTour] %s", title);
            emailService.sendHtmlEmail(guide.getUser().getEmail(), subject, htmlMessage);
        } catch (Exception e) {
            logger.error("Error notifying guide about schedule change request response: {}", e.getMessage());
        }
    }

    private void sendNewItineraryToCustomers(ScheduleChangeRequest request) {
        try {
            List<Booking> bookings = bookingRepository.findByScheduleIdAndStatus_StatusName(
                request.getScheduleId(), "CONFIRMED"
            );
            String subject = "Lịch trình tour của bạn đã được cập nhật";
            String itineraryHtml = request.getProposedChanges() != null
                ? request.getProposedChanges().replaceAll("(\r\n|\n)", "<br>")
                : "";
            String content = String.format(
                "<div style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>"
              + "<div style='max-width: 520px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px 28px;'>"
              + "<h2 style='color: #2563eb; margin-bottom: 18px;'>Lịch trình tour của bạn đã được cập nhật</h2>"
              + "<div style='margin-bottom: 12px;'><b>Schedule ID:</b> %d</div>"
              + "<div style='margin-bottom: 12px;'><b>Lịch trình mới:</b><div style='background:#e0f2fe; border-radius:6px; padding:8px 12px; margin-top:4px;'>%s</div></div>"
              + "<div style='font-size: 15px; color: #374151; margin-top: 18px;'>Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.</div>"
              + "</div>"
              + "<div style='text-align: center; color: #94a3b8; font-size: 13px; margin-top: 24px;'>TravelTour &copy; 2024</div>"
              + "</div>",
                request.getScheduleId(),
                itineraryHtml
            );
            for (Booking booking : bookings) {
                if (booking.getUser() != null && booking.getUser().getEmail() != null) {
                    emailService.sendHtmlEmail(booking.getUser().getEmail(), subject, content);
                }
            }
        } catch (Exception e) {
            logger.error("Error sending new itinerary email to customers: {}", e.getMessage());
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