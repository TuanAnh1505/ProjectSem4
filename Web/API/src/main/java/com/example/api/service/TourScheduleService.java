package com.example.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.api.dto.TourScheduleDTO;
import com.example.api.dto.TourItineraryDTO;
import com.example.api.model.Booking;
import com.example.api.model.Tour;
import com.example.api.model.TourSchedule;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.TourRepository;
import com.example.api.repository.TourScheduleRepository;
import com.example.api.model.BookingPassenger;
import com.example.api.model.User;
import com.example.api.repository.BookingPassengerRepository;

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
    private final TourItineraryService tourItineraryService;
    private final BookingPassengerRepository bookingPassengerRepository;

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
                    .filter(schedule -> schedule.getEndDate().isAfter(java.time.LocalDate.now()) || schedule.getEndDate().isEqual(java.time.LocalDate.now()))
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

        //  Lấy danh sách booking đã xác nhận để kiểm tra
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

    @Scheduled(cron = "0 0 6 * * ?")
    // @Scheduled(fixedDelay = 60000)
    @Transactional
    public void sendTourReminders() {
        logger.info("Bắt đầu gửi email nhắc nhở tour (1 ngày trước khi khởi hành)");
        LocalDate oneDayLater = LocalDate.now().plusDays(1);
        // twoDayLater
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
                        User user = booking.getUser();
                        String tourName = tour.getName();
                        String startDate = schedule.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        String endDate = schedule.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        String tourDetails = tour.getDescription() != null ? tour.getDescription()
                                : "Không có thông tin chi tiết";

                        // Lấy danh sách passengers cho booking này
                        List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(booking.getBookingId());

                        emailService.sendTourReminderEmailToAllPassengers(
                                user,
                                passengers,
                                tourName,
                                startDate,
                                endDate,
                                tourDetails);
                        logger.info(
                                "Đã gửi email nhắc nhở cho booking ID {} - Tour: {} - Khởi hành ngày {}",
                                booking.getBookingId(), tourName, startDate);
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

    @Scheduled(cron = "0 0 6 * * ?")
    // @Scheduled(fixedDelay = 60000)
    @Transactional
    public void sendTourItineraryEmails() {
        logger.info("Bắt đầu gửi email chi tiết lịch trình tour");
        LocalDate today = LocalDate.now();

        // Tìm tất cả lịch trình bắt đầu vào ngày hôm nay
        List<TourSchedule> schedules = repository.findByStartDate(today);
        logger.info("Tìm thấy {} lịch trình tour bắt đầu vào ngày {}",
                schedules.size(), today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        for (TourSchedule schedule : schedules) {
            try {
                // Lấy tất cả booking đã xác nhận cho lịch trình này
                List<Booking> confirmedBookings = bookingRepository
                        .findConfirmedBookingsForSchedule(schedule.getScheduleId());
                logger.info("Lịch trình tour ID {}: Tìm thấy {} booking đã xác nhận",
                        schedule.getScheduleId(), confirmedBookings.size());

                // Lấy thông tin tour
                Tour tour = tourRepository.findById(schedule.getTourId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tour"));

                // Lấy chi tiết lịch trình
                List<TourItineraryDTO> itineraries = tourItineraryService.getByScheduleId(schedule.getScheduleId());

                // Gửi email cho từng booking
                for (Booking booking : confirmedBookings) {
                    try {
                        User user = booking.getUser();
                        String tourName = tour.getName();
                        String startDate = schedule.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        String endDate = schedule.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

                        // Lấy danh sách passengers cho booking này
                        List<BookingPassenger> passengers = bookingPassengerRepository.findByBooking_BookingId(booking.getBookingId());

                        emailService.sendTourItineraryEmailToAllPassengers(
                                user,
                                passengers,
                                tourName,
                                startDate,
                                endDate,
                                itineraries);
                        logger.info(
                                "Đã gửi email chi tiết lịch trình cho booking ID {} - Tour: {}",
                                booking.getBookingId(), tourName);
                    } catch (Exception e) {
                        logger.error("Không thể gửi email chi tiết lịch trình cho booking ID {}: {}",
                                booking.getBookingId(), e.getMessage());
                    }
                }
            } catch (Exception e) {
                logger.error("Lỗi khi xử lý lịch trình tour ID {}: {}",
                        schedule.getScheduleId(), e.getMessage());
            }
        }
        logger.info("Hoàn thành việc gửi email chi tiết lịch trình tour");
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