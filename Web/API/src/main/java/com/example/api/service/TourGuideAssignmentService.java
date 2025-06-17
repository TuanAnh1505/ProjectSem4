package com.example.api.service;

import com.example.api.dto.TourGuideAssignmentDTO;
import com.example.api.model.Tour;
import com.example.api.model.TourGuide;
import com.example.api.model.TourGuideAssignment;
import com.example.api.repository.TourGuideAssignmentRepository;
import com.example.api.repository.TourGuideRepository;
import com.example.api.repository.TourRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class TourGuideAssignmentService {

    @Autowired
    private TourGuideAssignmentRepository assignmentRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TourGuideRepository tourGuideRepository;

    @Autowired
    private EmailService emailService;

    public TourGuideAssignmentDTO createAssignment(TourGuideAssignmentDTO dto) {
        // Check if tour exists
        Tour tour = tourRepository.findById(dto.getTourId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found with id: " + dto.getTourId()));

        // Check if guide exists
        TourGuide guide = tourGuideRepository.findById(dto.getGuideId().longValue())
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + dto.getGuideId()));

        // Check if guide is available
        if (!guide.getIsAvailable()) {
            throw new IllegalStateException("Hướng dẫn viên hiện không sẵn sàng!");
        }

        // Check if dates are valid
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc!");
        }

        // Check if schedule has already ended
        if (dto.getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Không thể gán hướng dẫn viên cho lịch trình đã kết thúc!");
        }

        // Check if guide has already been assigned to this tour & schedule
        boolean alreadyAssigned = assignmentRepository.findByTourId(dto.getTourId()).stream()
            .anyMatch(a -> a.getGuideId().equals(dto.getGuideId()) &&
                          a.getStartDate().equals(dto.getStartDate()) &&
                          a.getEndDate().equals(dto.getEndDate()));
        if (alreadyAssigned) {
            throw new IllegalStateException("Hướng dẫn viên đã được gán vào lịch trình này!");
        }

        // Check if guide has any overlapping assignments
        if (assignmentRepository.existsOverlappingAssignment(
                dto.getGuideId(),
                dto.getStartDate(),
                dto.getEndDate())) {
            throw new IllegalStateException("Hướng dẫn viên đã có tour khác trong khoảng thời gian này!");
        }

        TourGuideAssignment assignment = new TourGuideAssignment();
        assignment.setTourId(dto.getTourId());
        assignment.setGuideId(dto.getGuideId());
        assignment.setRole(dto.getRole());
        assignment.setStartDate(dto.getStartDate());
        assignment.setEndDate(dto.getEndDate());
        assignment.setStatus(TourGuideAssignment.AssignmentStatus.assigned);

        TourGuideAssignment savedAssignment = assignmentRepository.save(assignment);

        // Gửi email cho hướng dẫn viên
        try {
            // Lấy thông tin user (hướng dẫn viên)
            String guideEmail = guide.getUser() != null ? guide.getUser().getEmail() : null;
            String guideName = guide.getUser() != null ? guide.getUser().getFullName() : "Hướng dẫn viên";
            String tourName = tour.getName();
            String tourDesc = tour.getDescription();
            String startDate = assignment.getStartDate().toString();
            String endDate = assignment.getEndDate().toString();
            // Lấy danh sách khách hàng của tour/lịch trình này
            List<Map<String, String>> customers = new java.util.ArrayList<>();
            // (Giả sử bookingRepository có hàm findByTourIdAndScheduleId)
            // Nếu không, bạn cần tự join hoặc query phù hợp
            // Ở đây demo lấy tất cả booking CONFIRMED của tour này và lịch trình này
            // (Bạn có thể cần chỉnh lại cho đúng logic thực tế)
            // bookingRepository phải được @Autowired vào service này nếu chưa có
            //
            // Ví dụ:
            // List<Booking> bookings = bookingRepository.findByTour_TourIdAndScheduleIdAndStatus_StatusName(
            //     assignment.getTourId(), assignment.getStartDate(), "CONFIRMED");
            // for (Booking b : bookings) {
            //     for (BookingPassenger p : bookingPassengerRepository.findByBooking_BookingId(b.getBookingId())) {
            //         Map<String, String> c = new java.util.HashMap<>();
            //         c.put("name", p.getFullName());
            //         c.put("phone", p.getPhone());
            //         customers.add(c);
            //     }
            // }
            //
            // Tạm thời gửi mail không có khách nếu chưa có bookingRepository
            emailService.sendGuideAssignmentEmail(
                guideEmail,
                guideName,
                tourName,
                tourDesc,
                startDate,
                endDate,
                customers
            );
        } catch (Exception ex) {
            // Log lỗi gửi mail nhưng không làm fail nghiệp vụ
            System.err.println("Lỗi gửi mail phân công HDV: " + ex.getMessage());
        }
        return convertToDTO(savedAssignment);
    }

    public List<TourGuideAssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByTourId(Integer tourId) {
        return assignmentRepository.findByTourId(tourId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByGuideId(Integer guideId) {
        return assignmentRepository.findByGuideId(guideId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByTourIdAndGuideMinRating(Integer tourId, Double minRating) {
        return assignmentRepository.findByTourIdAndGuideMinRating(tourId, minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TourGuideAssignmentDTO> getAssignmentsByGuideIdAndTourStatus(Integer guideId, String statusName) {
        return assignmentRepository.findByGuideIdAndTourStatus(guideId, statusName).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TourGuideAssignmentDTO updateAssignmentStatus(Integer assignmentId, TourGuideAssignment.AssignmentStatus newStatus) {
        TourGuideAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));

        assignment.setStatus(newStatus);
        TourGuideAssignment updatedAssignment = assignmentRepository.save(assignment);
        return convertToDTO(updatedAssignment);
    }

    public void deleteAssignment(Integer assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new EntityNotFoundException("Assignment not found with id: " + assignmentId);
        }
        assignmentRepository.deleteById(assignmentId);
    }

    private TourGuideAssignmentDTO convertToDTO(TourGuideAssignment assignment) {
        TourGuideAssignmentDTO dto = new TourGuideAssignmentDTO();
        dto.setAssignmentId(assignment.getAssignmentId());
        dto.setTourId(assignment.getTourId());
        dto.setGuideId(assignment.getGuideId());
        dto.setRole(assignment.getRole());
        dto.setStartDate(assignment.getStartDate());
        dto.setEndDate(assignment.getEndDate());
        dto.setStatus(assignment.getStatus());

        // Set tour information if available
        if (assignment.getTour() != null) {
            Tour tour = assignment.getTour();
            dto.setTourName(tour.getName());
            dto.setTourDescription(tour.getDescription());
        }

        // Set guide information if available
        if (assignment.getGuide() != null) {
            TourGuide guide = assignment.getGuide();
            dto.setGuideName(guide.getUser() != null ? guide.getUser().getFullName() : null);
            dto.setGuideSpecialization(guide.getSpecialization());
            dto.setGuideLanguages(guide.getLanguages());
            dto.setGuideRating(guide.getRating());
        }

        return dto;
    }
} 