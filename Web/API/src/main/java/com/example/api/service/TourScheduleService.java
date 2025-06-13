package com.example.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.api.dto.TourScheduleDTO;
import com.example.api.model.Booking;
import com.example.api.model.Tour;
import com.example.api.model.TourSchedule;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.TourRepository;
import com.example.api.repository.TourScheduleRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(TourScheduleService.class);
    private final TourScheduleRepository repository;
    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final EmailService emailService;

    @Transactional
    public TourScheduleDTO create(TourScheduleDTO dto) {
        try {
            validateDates(dto);
            TourSchedule entity = mapToEntity(dto);
            TourSchedule saved = repository.save(entity);
            return mapToDTO(saved);
        } catch (Exception e) {
            logger.error("Error creating tour schedule", e);
            throw new RuntimeException("Failed to create tour schedule: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public TourScheduleDTO getById(Integer id) {
        try {
            TourSchedule entity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tour schedule not found with id: " + id));
            return mapToDTO(entity);
        } catch (Exception e) {
            logger.error("Error retrieving tour schedule with id: " + id, e);
            throw new RuntimeException("Failed to retrieve tour schedule: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<TourScheduleDTO> getByTourId(Integer tourId) {
        try {
            return repository.findByTourId(tourId)
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving tour schedules for tour id: " + tourId, e);
            throw new RuntimeException("Failed to retrieve tour schedules: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<TourScheduleDTO> getAll() {
        try {
            logger.info("Retrieving all tour schedules from repository");
            List<TourSchedule> entities = repository.findAll();
            logger.info("Found {} tour schedules", entities.size());
            return entities.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving all tour schedules", e);
            throw new RuntimeException("Failed to retrieve tour schedules: " + e.getMessage());
        }
    }

    @Transactional
    public TourScheduleDTO update(Integer id, TourScheduleDTO dto) {
        try {
            TourSchedule entity = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tour schedule not found with id: " + id));
            validateDates(dto);
            mapToEntity(dto, entity);
            entity.setUpdatedAt(LocalDateTime.now());
            TourSchedule updated = repository.save(entity);
            return mapToDTO(updated);
        } catch (Exception e) {
            logger.error("Error updating tour schedule with id: " + id, e);
            throw new RuntimeException("Failed to update tour schedule: " + e.getMessage());
        }
    }

    @Transactional
    public void delete(Integer id) {
        try {
            if (!repository.existsById(id)) {
                throw new IllegalArgumentException("Tour schedule not found with id: " + id);
            }
            repository.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting tour schedule with id: " + id, e);
            throw new RuntimeException("Failed to delete tour schedule: " + e.getMessage());
        }
    }

    @Transactional
    public void checkAndUpdateScheduleStatus(Integer bookingId) {
        logger.info("Checking schedule status for bookingId: {}", bookingId);

        // Bước 1: Xác định lịch trình từ booking_id
        Integer scheduleId = bookingRepository.findScheduleIdByBookingId(bookingId);
        if (scheduleId == null) {
            logger.warn("No schedule found for bookingId: {}", bookingId);
            return;
        }
        logger.info("Found scheduleId: {}", scheduleId);

        // Bước 2: Lấy danh sách booking đã xác nhận để kiểm tra
        List<Booking> confirmedBookings = bookingRepository.findConfirmedBookingsForSchedule(scheduleId);
        logger.info("Found {} confirmed bookings for schedule {}", confirmedBookings.size(), scheduleId);

        // Log chi tiết từng booking
        for (Booking booking : confirmedBookings) {
            logger.info("Booking {} - User: {} (ID: {})",
                    booking.getBookingId(),
                    booking.getUser().getFullName(),
                    booking.getUser().getUserid());
        }

        // Bước 3: Đếm số lượng hành khách đã thanh toán thành công
        long confirmedPassengers = bookingRepository.countConfirmedPassengersForSchedule(scheduleId);
        long bookingsWithoutBookerAsPassenger = bookingRepository.countBookingsWithoutBookerAsPassenger(scheduleId);

        // Tổng số người tham gia = số hành khách + số booking mà người đặt không phải
        // là hành khách
        long totalParticipants = confirmedPassengers + bookingsWithoutBookerAsPassenger;

        logger.info("Detailed count for schedule {}:", scheduleId);
        logger.info("- Number of confirmed passengers (unique): {}", confirmedPassengers);
        logger.info("- Number of bookings where booker is not a passenger: {}", bookingsWithoutBookerAsPassenger);
        logger.info("- Total participants: {}", totalParticipants);

        // Bước 4: Lấy thông tin tour và max_participants
        TourSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));

        Tour tour = tourRepository.findById(schedule.getTourId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour"));

        logger.info("Tour details for schedule {}:", scheduleId);
        logger.info("- Tour ID: {}", tour.getTourId());
        logger.info("- Tour name: {}", tour.getName());
        logger.info("- Max participants: {}", tour.getMaxParticipants());
        logger.info("- Current schedule status: {}", schedule.getStatus().getValue());

        // Bước 5: So sánh và cập nhật trạng thái
        if (totalParticipants >= tour.getMaxParticipants()) {
            logger.info("Updating schedule status to FULL. Total participants ({}) >= max participants ({})",
                    totalParticipants, tour.getMaxParticipants());
            schedule.setStatus(TourSchedule.Status.full);
            repository.save(schedule);
            logger.info("Schedule status updated successfully to FULL");
        } else {
            logger.info("Schedule remains available. Total participants ({}) < max participants ({})",
                    totalParticipants, tour.getMaxParticipants());
        }
    }

    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional
    public void sendTourReminders() {
        logger.info("Bắt đầu gửi email nhắc nhở tour (1 ngày trước khi khởi hành)");
        LocalDate oneDayLater = LocalDate.now().plusDays(1);

        // Find all schedules starting in 1 day
        List<TourSchedule> schedules = repository.findByStartDate(oneDayLater);
        logger.info("Tìm thấy {} lịch trình tour sẽ khởi hành sau 1 ngày (ngày {})",
                schedules.size(), oneDayLater.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        for (TourSchedule schedule : schedules) {
            try {
                // Get all confirmed bookings for this schedule
                List<Booking> confirmedBookings = bookingRepository
                        .findConfirmedBookingsForSchedule(schedule.getScheduleId());
                logger.info("Lịch trình tour ID {}: Tìm thấy {} booking đã xác nhận",
                        schedule.getScheduleId(), confirmedBookings.size());

                // Get tour details
                Tour tour = tourRepository.findById(schedule.getTourId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tour"));

                // Send reminder email to each booking
                for (Booking booking : confirmedBookings) {
                    try {
                        String userName = booking.getUser().getFullName();
                        String userEmail = booking.getUser().getEmail();
                        String tourName = tour.getName();
                        String startDate = schedule.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        String endDate = schedule.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        String tourDetails = tour.getDescription() != null ? tour.getDescription()
                                : "Không có thông tin chi tiết";

                        emailService.sendTourReminderEmail(
                                userEmail,
                                userName,
                                tourName,
                                startDate,
                                endDate,
                                tourDetails);
                        logger.info(
                                "Đã gửi email nhắc nhở cho khách hàng {} (email: {}) - Tour: {} - Khởi hành ngày {}",
                                userName, userEmail, tourName, startDate);
                    } catch (Exception e) {
                        logger.error("Không thể gửi email nhắc nhở cho booking ID {}: {}",
                                booking.getBookingId(), e.getMessage());
                    }
                }
            } catch (Exception e) {
                logger.error("Lỗi khi xử lý lịch trình tour ID {}: {}",
                        schedule.getScheduleId(), e.getMessage());
            }
        }
        logger.info("Hoàn thành việc gửi email nhắc nhở tour");
    }

    private void validateDates(TourScheduleDTO dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        if (dto.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }
    }

    private TourScheduleDTO mapToDTO(TourSchedule entity) {
        TourScheduleDTO dto = new TourScheduleDTO();
        dto.setScheduleId(entity.getScheduleId());
        dto.setTourId(entity.getTourId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());

        // Đếm số người đã tham gia
        long confirmedPassengers = bookingRepository.countConfirmedPassengersForSchedule(entity.getScheduleId());
        long bookingsWithoutBookerAsPassenger = bookingRepository
                .countBookingsWithoutBookerAsPassenger(entity.getScheduleId());
        int totalParticipants = (int) (confirmedPassengers + bookingsWithoutBookerAsPassenger);

        // Lấy maxParticipants từ tour
        Tour tour = tourRepository.findById(entity.getTourId()).orElse(null);

        // Nếu đã qua ngày bắt đầu, cập nhật trạng thái closed
        LocalDate today = LocalDate.now();
        if (!today.isBefore(entity.getStartDate())) {
            if (!"closed".equals(entity.getStatus().getValue())) {
                entity.setStatus(TourSchedule.Status.closed);
                repository.save(entity);
            }
            dto.setStatus("closed");
        } else if (tour != null && totalParticipants >= tour.getMaxParticipants()) {
            if (!"full".equals(entity.getStatus().getValue())) {
                entity.setStatus(TourSchedule.Status.full);
                repository.save(entity);
            }
            dto.setStatus("full");
        } else {
            dto.setStatus(entity.getStatus().getValue());
        }

        dto.setCurrentParticipants(totalParticipants);
        return dto;
    }

    private TourSchedule mapToEntity(TourScheduleDTO dto) {
        TourSchedule entity = new TourSchedule();
        mapToEntity(dto, entity);
        return entity;
    }

    private void mapToEntity(TourScheduleDTO dto, TourSchedule entity) {
        entity.setTourId(dto.getTourId());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setStatus(TourSchedule.Status.fromString(dto.getStatus()));
    }
}