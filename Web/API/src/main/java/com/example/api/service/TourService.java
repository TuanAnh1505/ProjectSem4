package com.example.api.service;

import com.example.api.dto.DestinationDTO;
import com.example.api.dto.TourDTO;
import com.example.api.model.*;
import com.example.api.repository.*;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Transactional
public class TourService {

    private final TourRepository tourRepo;
    private final DestinationRepository destRepo;
    private final EventRepository eventRepo;
    private final ExperienceRepository experienceRepo;
    private final BookingRepository bookingRepo;
    private final TourScheduleRepository tourScheduleRepo;
    private final TourGuideAssignmentRepository tourGuideAssignmentRepo;
    private final FeedbackRepository feedbackRepo;
    private final UserDiscountRepository userDiscountRepo;
    private final TourItineraryRepository tourItineraryRepo;
    private final BookingPassengerRepository bookingPassengerRepo;
    private final PaymentRepository paymentRepo;
    @PersistenceContext
    private EntityManager entityManager;

    public Tour createTour(TourDTO dto) {
        Tour tour = new Tour();
        BeanUtils.copyProperties(dto, tour);
        if (dto.getImageUrls() != null) {
            tour.setImageUrls(dto.getImageUrls());
        }
        tour.setDestinations(destRepo.findAllById(dto.getDestinationIds() != null ? dto.getDestinationIds() : Collections.emptyList()));
        tour.setEvents(eventRepo.findAllById(dto.getEventIds() != null ? dto.getEventIds() : Collections.emptyList()));
        return tourRepo.save(tour);
    }

    public Tour updateTour(Integer id, TourDTO dto) {
        Tour tour = tourRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        BeanUtils.copyProperties(dto, tour, "tourId");
        if (dto.getImageUrls() != null) {
            tour.setImageUrls(dto.getImageUrls());
        }
        tour.setDestinations(destRepo.findAllById(dto.getDestinationIds() != null ? dto.getDestinationIds() : Collections.emptyList()));
        tour.setEvents(eventRepo.findAllById(dto.getEventIds() != null ? dto.getEventIds() : Collections.emptyList()));
        return tourRepo.save(tour);
    }

    public void deleteTour(Integer id) {
        // Kiểm tra tour có tồn tại không
        Tour tour = tourRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        
        // Xóa tất cả các bản ghi liên quan theo thứ tự để tránh foreign key constraint
        
        // 1. Xóa experiences
        List<Experience> experiences = experienceRepo.findByTour_TourId(id.longValue());
        experienceRepo.deleteAll(experiences);
        
        // 2. Xóa user_discounts
        List<UserDiscount> userDiscounts = userDiscountRepo.findAll().stream()
                .filter(ud -> ud.getTourId().equals(id))
                .collect(Collectors.toList());
        userDiscountRepo.deleteAll(userDiscounts);
        
        // 3. Xóa feedbacks
        List<Feedback> feedbacks = feedbackRepo.findByTour_TourId(id);
        feedbackRepo.deleteAll(feedbacks);
        
        // 4. Xóa tour_guide_assignments
        List<TourGuideAssignment> assignments = tourGuideAssignmentRepo.findByTourId(id);
        tourGuideAssignmentRepo.deleteAll(assignments);
        
        // 5. Lấy tất cả schedule_id của tour này
        List<TourSchedule> schedules = tourScheduleRepo.findByTourId(id);
        List<Integer> scheduleIds = schedules.stream().map(TourSchedule::getScheduleId).collect(Collectors.toList());
        
        // 6. Xóa tất cả bookings có schedule_id thuộc các schedule này (dù tour_id là gì)
        List<Booking> bookingsToDelete = bookingRepo.findAll().stream()
            .filter(b -> scheduleIds.contains(b.getScheduleId()))
            .collect(Collectors.toList());
        for (Booking booking : bookingsToDelete) {
            List<BookingPassenger> passengers = bookingPassengerRepo.findByBooking_BookingId(booking.getBookingId());
            bookingPassengerRepo.deleteAll(passengers);
            List<Payment> payments = paymentRepo.findByBooking_BookingId(booking.getBookingId());
            paymentRepo.deleteAll(payments);
        }
        bookingRepo.deleteAll(bookingsToDelete);
        
        // 7. Xóa bookings còn lại có tour_id trùng (nếu có)
        List<Booking> bookings = bookingRepo.findAll().stream()
                .filter(b -> b.getTour().getTourId().equals(id))
                .collect(Collectors.toList());
        for (Booking booking : bookings) {
            List<BookingPassenger> passengers = bookingPassengerRepo.findByBooking_BookingId(booking.getBookingId());
            bookingPassengerRepo.deleteAll(passengers);
            List<Payment> payments = paymentRepo.findByBooking_BookingId(booking.getBookingId());
            paymentRepo.deleteAll(payments);
        }
        bookingRepo.deleteAll(bookings);
        
        // 8. Xóa tour_schedules và tour_itineraries
        for (TourSchedule schedule : schedules) {
            List<TourItinerary> itineraries = tourItineraryRepo.findByScheduleId(schedule.getScheduleId());
            tourItineraryRepo.deleteAll(itineraries);
        }
        tourScheduleRepo.deleteAll(schedules);
        
        // 9. Cuối cùng xóa tour (các bảng many-to-many sẽ tự động được xử lý)
        tourRepo.deleteById(id);
    }

    public Tour getTourDetail(Integer id) {
        return tourRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
    }

    public List<Tour> getAllTours() {
        return tourRepo.findAll();
    }

    public List<Tour> getFilteredTours(Integer destinationId, Integer month, Integer year, Double minPrice, Double maxPrice) {
        Specification<Tour> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (destinationId != null) {
                Join<Tour, Destination> destinationJoin = root.join("destinations");
                predicates.add(criteriaBuilder.equal(destinationJoin.get("id"), destinationId));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            
            // Note: This assumes you have TourSchedule entities linked to your Tour
            if (month != null || year != null) {
                Join<Tour, TourSchedule> scheduleJoin = root.join("schedules");
                if (month != null) {
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.function("month", Integer.class, scheduleJoin.get("startDate")), month));
                }
                if (year != null) {
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.function("year", Integer.class, scheduleJoin.get("startDate")), year));
                }
            }
            
            // This prevents duplicate tours when joining with destinations or schedules
            query.distinct(true);

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return tourRepo.findAll(spec);
    }

    public List<Tour> getRandomTours(int count, Integer excludeTourId) {
        String sql = "SELECT * FROM tours WHERE tour_id <> :excludeTourId ORDER BY RAND() LIMIT " + count;
        return entityManager.createNativeQuery(sql, Tour.class)
                .setParameter("excludeTourId", excludeTourId)
                .getResultList();
    }

    public List<DestinationDTO> getTourDestinations(Integer tourId) {
        List<Destination> destinations = tourRepo.findById(tourId)
                .map(Tour::getDestinations)
                .orElse(Collections.emptyList());

        return destinations.stream()
                .map(this::convertToDestinationDTO)
                .collect(Collectors.toList());
    }

    private DestinationDTO convertToDestinationDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setId(destination.getDestinationId());
        dto.setName(destination.getName());
        dto.setDescription(destination.getDescription());
        dto.setImageUrls(destination.getFilePaths());
        return dto;
    }

    public List<Event> getTourEvents(Integer tourId) {
        return tourRepo.findById(tourId)
                .map(Tour::getEvents)
                .orElse(Collections.emptyList());
    }

    public Tour getTourByName(String name) {
        Tour tour = tourRepo.findByName(name);
        if (tour == null) throw new RuntimeException("Tour not found");
        return tour;
    }
}
