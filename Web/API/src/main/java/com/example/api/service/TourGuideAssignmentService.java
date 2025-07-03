package com.example.api.service;

import com.example.api.dto.TourGuideAssignmentDTO;
import com.example.api.dto.TourDetailForGuideDTO;
import com.example.api.dto.TourItineraryDTO;
import com.example.api.dto.PassengerDetailDTO;
import com.example.api.model.Tour;
import com.example.api.model.TourGuide;
import com.example.api.model.TourGuideAssignment;
import com.example.api.model.TourSchedule;
import com.example.api.model.TourItinerary;
import com.example.api.model.Booking;
import com.example.api.model.BookingPassenger;
import com.example.api.repository.TourGuideAssignmentRepository;
import com.example.api.repository.TourGuideRepository;
import com.example.api.repository.TourRepository;
import com.example.api.repository.TourScheduleRepository;
import com.example.api.repository.TourItineraryRepository;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.BookingPassengerRepository;
import com.example.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Optional;

@Service
@Transactional
public class TourGuideAssignmentService {

    private final TourGuideAssignmentRepository assignmentRepository;
    private final TourRepository tourRepository;
    private final TourGuideRepository tourGuideRepository;
    private final UserRepository userRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final ApplicationContext applicationContext;
    private final TourItineraryRepository tourItineraryRepository;
    private final BookingRepository bookingRepository;
    private final BookingPassengerRepository bookingPassengerRepository;

    @Autowired
    public TourGuideAssignmentService(TourGuideAssignmentRepository assignmentRepository,
            TourRepository tourRepository,
            TourGuideRepository tourGuideRepository,
            UserRepository userRepository,
            TourScheduleRepository tourScheduleRepository,
            ApplicationContext applicationContext,
            TourItineraryRepository tourItineraryRepository,
            BookingRepository bookingRepository,
            BookingPassengerRepository bookingPassengerRepository) {
        this.assignmentRepository = assignmentRepository;
        this.tourRepository = tourRepository;
        this.tourGuideRepository = tourGuideRepository;
        this.userRepository = userRepository;
        this.tourScheduleRepository = tourScheduleRepository;
        this.applicationContext = applicationContext;
        this.tourItineraryRepository = tourItineraryRepository;
        this.bookingRepository = bookingRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
    }

    private EmailService getEmailService() {
        return applicationContext.getBean(EmailService.class);
    }

    public TourGuideAssignmentDTO createAssignment(TourGuideAssignmentDTO dto) {
     
        Tour tour = tourRepository.findById(dto.getTourId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found with id: " + dto.getTourId()));

     
        TourGuide guide = tourGuideRepository.findById(dto.getGuideId().longValue())
                .orElseThrow(() -> new EntityNotFoundException("Tour guide not found with id: " + dto.getGuideId()));

     
        if (!guide.getIsAvailable()) {
            throw new IllegalStateException("Hướng dẫn viên hiện không sẵn sàng!");
        }

       
        if (guide.getUser() == null || guide.getUser().getIsActive() == null || !guide.getUser().getIsActive()) {
            throw new IllegalStateException("Tài khoản hướng dẫn viên không hoạt động, không thể phân công!");
        }

     
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc!");
        }

      
        if (dto.getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Không thể gán hướng dẫn viên cho lịch trình đã kết thúc!");
        }

       
        boolean alreadyAssigned = assignmentRepository.existsByGuideIdAndTourSchedule_ScheduleId(
            dto.getGuideId(), dto.getScheduleId()
        );
        if (alreadyAssigned) {
            throw new IllegalStateException("Hướng dẫn viên đã được phân công vào lịch trình này rồi!");
        }

       
        if (assignmentRepository.existsOverlappingAssignment(
                dto.getGuideId(),
                dto.getStartDate(),
                dto.getEndDate())) {
            throw new IllegalStateException("Hướng dẫn viên đã có tour khác trong khoảng thời gian này!");
        }

        TourSchedule schedule = tourScheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Schedule ID: " + dto.getScheduleId()));
        
    
        if (!schedule.getTourId().equals(dto.getTourId())) {
            throw new IllegalArgumentException("Schedule does not belong to the specified tour.");
        }

        TourGuideAssignment assignment = new TourGuideAssignment();
        assignment.setTour(tour);
        assignment.setTourId(dto.getTourId());
        assignment.setGuide(guide);
        assignment.setGuideId(dto.getGuideId());
        assignment.setTourSchedule(schedule);
        assignment.setRole(dto.getRole());
        assignment.setStartDate(dto.getStartDate());
        assignment.setEndDate(dto.getEndDate());
        assignment.setStatus(TourGuideAssignment.AssignmentStatus.assigned);

        TourGuideAssignment savedAssignment = assignmentRepository.save(assignment);

        
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


    public List<TourGuideAssignmentDTO> getCurrentGuideAssignments() {
    
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        var currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));

      
        TourGuide currentGuide = tourGuideRepository.findByUserId(currentUser.getUserid())
                .orElseThrow(() -> new EntityNotFoundException("Current user is not a tour guide"));

        return assignmentRepository.findByGuideId(currentGuide.getGuideId().intValue()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

   
    public List<Map<String, Object>> getCurrentGuideAssignmentsWithDetails() {
       
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        var currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));

       
        TourGuide currentGuide = tourGuideRepository.findByUserId(currentUser.getUserid())
                .orElseThrow(() -> new EntityNotFoundException("Current user is not a tour guide"));

        List<TourGuideAssignment> assignments = assignmentRepository
                .findByGuideId(currentGuide.getGuideId().intValue());

        return assignments.stream().map(assignment -> {
            Map<String, Object> assignmentDetail = new HashMap<>();
            assignmentDetail.put("assignmentId", assignment.getAssignmentId());
            assignmentDetail.put("tourId", assignment.getTourId());
            assignmentDetail.put("guideId", assignment.getGuideId());
            assignmentDetail.put("role", assignment.getRole());
            assignmentDetail.put("startDate", assignment.getStartDate());
            assignmentDetail.put("endDate", assignment.getEndDate());
            assignmentDetail.put("status", assignment.getStatus());

          
            if (assignment.getTour() != null) {
                Tour tour = assignment.getTour();
                assignmentDetail.put("tourName", tour.getName());
                assignmentDetail.put("tourDescription", tour.getDescription());
          
                String firstImageUrl = (tour.getImageUrls() != null && !tour.getImageUrls().isEmpty())
                        ? tour.getImageUrls().get(0)
                        : null;
                assignmentDetail.put("tourImage", firstImageUrl);
                assignmentDetail.put("tourPrice", tour.getPrice());
                assignmentDetail.put("tourDuration", tour.getDuration());
            }

         
            tourScheduleRepository.findByTourIdAndStartDate(assignment.getTourId(), assignment.getStartDate())
                    .ifPresent(schedule -> assignmentDetail.put("scheduleId", schedule.getScheduleId()));

         
            if (assignment.getGuide() != null) {
                TourGuide guide = assignment.getGuide();
                assignmentDetail.put("guideName", guide.getUser() != null ? guide.getUser().getFullName() : null);
                assignmentDetail.put("guideSpecialization", guide.getSpecialization());
                assignmentDetail.put("guideLanguages", guide.getLanguages());
                assignmentDetail.put("guideRating", guide.getRating());
            }

           
            LocalDate today = LocalDate.now();
            String category;
            if (assignment.getEndDate().isBefore(today)) {
                category = "completed"; 
            } else if (assignment.getStartDate().isAfter(today)) {
                category = "upcoming";
            } else {
                category = "ongoing"; 
            }
            assignmentDetail.put("category", category);

            return assignmentDetail;
        }).collect(Collectors.toList());
    }

    public TourGuideAssignmentDTO updateAssignmentStatus(Integer assignmentId,
            TourGuideAssignment.AssignmentStatus newStatus) {
        TourGuideAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));

        assignment.setStatus(newStatus);
        TourGuideAssignment updatedAssignment = assignmentRepository.save(assignment);
        return convertToDTO(updatedAssignment);
    }


    public TourGuideAssignmentDTO updateAssignmentStatusByMainGuide(Integer assignmentId, String newStatus) {
      
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        var currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));

      
        TourGuide currentGuide = tourGuideRepository.findByUserId(currentUser.getUserid())
                .orElseThrow(() -> new EntityNotFoundException("Current user is not a tour guide"));

   
        TourGuideAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));

     
        if (!assignment.getGuideId().equals(currentGuide.getGuideId().intValue())) {
            throw new IllegalStateException("Bạn không có quyền cập nhật trạng thái của assignment này!");
        }

       
        if (assignment.getRole() != TourGuideAssignment.GuideRole.main_guide) {
            throw new IllegalStateException("Chỉ hướng dẫn viên chính (main_guide) mới có quyền cập nhật trạng thái!");
        }

      
        TourGuideAssignment.AssignmentStatus status;
        try {
            status = TourGuideAssignment.AssignmentStatus.valueOf(newStatus.toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + newStatus);
        }

  
        assignment.setStatus(status);
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
        dto.setScheduleId(assignment.getTourSchedule() != null ? assignment.getTourSchedule().getScheduleId() : null);
        dto.setRole(assignment.getRole());
        dto.setStartDate(assignment.getStartDate());
        dto.setEndDate(assignment.getEndDate());
        dto.setStatus(assignment.getStatus());

    
        if (assignment.getTour() != null) {
            Tour tour = assignment.getTour();
            dto.setTourName(tour.getName());
            dto.setTourDescription(tour.getDescription());
        }

   
        if (assignment.getGuide() != null) {
            TourGuide guide = assignment.getGuide();
            dto.setGuideName(guide.getUser() != null ? guide.getUser().getFullName() : null);
            dto.setGuideSpecialization(guide.getSpecialization());
            dto.setGuideLanguages(guide.getLanguages());
            dto.setGuideRating(guide.getRating());
        }

        return dto;
    }

  
    public TourDetailForGuideDTO getTourDetailForGuide(Integer tourId, LocalDate startDate) {
    
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        var currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
        TourGuide currentGuide = tourGuideRepository.findByUserId(currentUser.getUserid())
                .orElseThrow(() -> new EntityNotFoundException("Current user is not a tour guide"));

     
        assignmentRepository.findByTourIdAndGuideIdAndStartDate(tourId, currentGuide.getGuideId().intValue(), startDate)
                .orElseThrow(() -> new IllegalStateException("Bạn không được phân công cho tour này vào ngày này."));

    
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tour với ID: " + tourId));
        TourSchedule schedule = tourScheduleRepository.findByTourIdAndStartDate(tourId, startDate)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy lịch trình cho tour " + tourId + " vào ngày " + startDate));

 
        List<TourItinerary> itineraries = tourItineraryRepository.findByScheduleId(schedule.getScheduleId());


        List<Booking> confirmedBookings = bookingRepository
                .findByScheduleIdAndStatus_StatusName(schedule.getScheduleId(), "CONFIRMED");
        List<BookingPassenger> passengers = confirmedBookings.stream()
                .flatMap(booking -> bookingPassengerRepository.findByBooking_BookingId(booking.getBookingId()).stream())
                .collect(Collectors.toList());

     
        TourDetailForGuideDTO dto = new TourDetailForGuideDTO();
        dto.setTourId(tour.getTourId());
        dto.setTourName(tour.getName());
        dto.setTourDescription(tour.getDescription());
        dto.setTourImage(
                tour.getImageUrls() != null && !tour.getImageUrls().isEmpty() ? tour.getImageUrls().get(0) : null);
        dto.setTourPrice(tour.getPrice());
        dto.setTourDuration(tour.getDuration());
        dto.setStartDate(schedule.getStartDate());
        dto.setEndDate(schedule.getEndDate());
        dto.setScheduleStatus(schedule.getStatus() != null ? schedule.getStatus().getValue() : "N/A");
        dto.setMaxCapacity(tour.getMaxParticipants());
        dto.setCurrentBookings(confirmedBookings.size());
        dto.setItinerary(itineraries.stream().map(this::convertToItineraryDTO).collect(Collectors.toList()));
        dto.setPassengers(passengers.stream().map(this::convertToPassengerDTO).collect(Collectors.toList()));
        dto.setScheduleId(schedule.getScheduleId());
        dto.setGuideId(currentGuide.getGuideId().intValue());
        return dto;
    }

    private TourItineraryDTO convertToItineraryDTO(TourItinerary itinerary) {
        TourItineraryDTO dto = new TourItineraryDTO();
        dto.setItineraryId(itinerary.getItineraryId());
        dto.setScheduleId(itinerary.getScheduleId());
        dto.setTitle(itinerary.getTitle());
        dto.setDescription(itinerary.getDescription());
        dto.setStartTime(itinerary.getStartTime());
        dto.setEndTime(itinerary.getEndTime());
        dto.setType(itinerary.getType());
        return dto;
    }

    private PassengerDetailDTO convertToPassengerDTO(BookingPassenger passenger) {
        PassengerDetailDTO dto = new PassengerDetailDTO();
        dto.setFullName(passenger.getFullName());
        dto.setEmail(passenger.getEmail());
        dto.setPhone(passenger.getPhone());
        dto.setBirthDate(passenger.getBirthDate());
        dto.setGender(passenger.getGender());
        dto.setPassengerType(passenger.getPassengerType() != null ? passenger.getPassengerType().name() : null);
        return dto;
    }

  
    public TourGuideAssignmentDTO autoUpdateAssignmentStatus(Integer assignmentId) {
        TourGuideAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));

        LocalDate today = LocalDate.now();
        TourGuideAssignment.AssignmentStatus newStatus = determineAutoStatus(assignment, today);

        if (newStatus != assignment.getStatus()) {
            assignment.setStatus(newStatus);
            TourGuideAssignment updatedAssignment = assignmentRepository.save(assignment);
            return convertToDTO(updatedAssignment);
        }

        return convertToDTO(assignment);
    }


    public Map<String, Object> autoUpdateAllAssignments() {
        List<TourGuideAssignment> allAssignments = assignmentRepository.findAll();
        LocalDate today = LocalDate.now();

        int updatedCount = 0;
        int totalCount = allAssignments.size();

        for (TourGuideAssignment assignment : allAssignments) {
            TourGuideAssignment.AssignmentStatus newStatus = determineAutoStatus(assignment, today);
            if (newStatus != assignment.getStatus()) {
                assignment.setStatus(newStatus);
                assignmentRepository.save(assignment);
                updatedCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalAssignments", totalCount);
        result.put("updatedAssignments", updatedCount);
        result.put("message", "Auto-updated " + updatedCount + " out of " + totalCount + " assignments");

        return result;
    }

    
    private TourGuideAssignment.AssignmentStatus determineAutoStatus(TourGuideAssignment assignment, LocalDate today) {
       
        if (assignment.getStatus() == TourGuideAssignment.AssignmentStatus.cancelled) {
            return assignment.getStatus();
        }

        
        if (assignment.getEndDate().isBefore(today)) {
            return TourGuideAssignment.AssignmentStatus.completed;
        }

        
        if (!assignment.getStartDate().isAfter(today) && !assignment.getEndDate().isBefore(today)) {
            return TourGuideAssignment.AssignmentStatus.inprogress;
        }

      
        if (assignment.getStartDate().isAfter(today)) {
            return TourGuideAssignment.AssignmentStatus.assigned;
        }

       
        return assignment.getStatus();
    }
    
}