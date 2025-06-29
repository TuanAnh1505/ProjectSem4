package com.example.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.api.dto.BookingPassengerDTO;
import com.example.api.dto.BookingPassengerRequestDTO;
import com.example.api.dto.PassengerDetailDTO;
import com.example.api.model.Booking;
import com.example.api.model.BookingPassenger;
import com.example.api.model.Tour;
import com.example.api.model.User;
import com.example.api.repository.BookingPassengerRepository;
import com.example.api.repository.BookingRepository;
import com.example.api.repository.TourRepository;
import com.example.api.repository.UserRepository;
import com.example.api.repository.DiscountRepository;
import com.example.api.model.Discount;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingPassengerService {

    private final BookingPassengerRepository bookingPassengerRepo;
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final TourRepository tourRepo;
    private final DiscountRepository discountRepo;

    public BookingPassengerDTO create(BookingPassengerDTO dto) {
        if (dto.getAddress() != null && dto.getAddress().trim().isEmpty()) {
            dto.setAddress(null);
        }
        BookingPassenger passenger = mapToEntity(dto);
        return mapToDTO(bookingPassengerRepo.save(passenger));
    }

    public BookingPassengerDTO update(Integer id, BookingPassengerDTO dto) {
        BookingPassenger existing = bookingPassengerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setEmail(dto.getEmail());
        String address = dto.getAddress();
        existing.setAddress(address != null && address.trim().isEmpty() ? null : address);
        existing.setPassengerType(BookingPassenger.PassengerType.valueOf(dto.getPassengerType()));
        return mapToDTO(bookingPassengerRepo.save(existing));
    }

    public void delete(Integer id) {
        bookingPassengerRepo.deleteById(id);
    }

    public BookingPassengerDTO getById(Integer id) {
        return bookingPassengerRepo.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
    }

    public List<BookingPassengerDTO> getByBookingId(Integer bookingId) {
        return bookingPassengerRepo.findByBooking_BookingId(bookingId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingPassengerDTO> getPassengersByScheduleId(Integer scheduleId) {
        List<Booking> confirmedBookings = bookingRepo.findByScheduleIdAndStatus_StatusName(scheduleId, "CONFIRMED");

        return confirmedBookings.stream()
            .flatMap(booking -> bookingPassengerRepo.findByBooking_BookingId(booking.getBookingId()).stream())
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<BookingPassengerDTO> createPassengers(BookingPassengerRequestDTO request) {
        log.info("Received booking passenger request: {}", request);
        validateRequest(request);
        List<BookingPassengerDTO> createdPassengers = new ArrayList<>();

        try {
            Booking booking = bookingRepo.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + request.getBookingId()));
            User user = userRepo.findByPublicId(request.getPublicId())
                    .orElseThrow(() -> new RuntimeException("User not found with publicId: " + request.getPublicId()));

            // 1. Tạo contactPassenger (người lớn 1)
            BookingPassengerDTO contactPassenger = createContactPassenger(request, booking.getBookingId(),
                    user.getPublicId());
            createdPassengers.add(contactPassenger);
            List<Integer> adultPassengerIds = new ArrayList<>();
            adultPassengerIds.add(contactPassenger.getPassengerId());

            // 2. Tạo các người lớn còn lại (nếu có)
            int numAdults = request.getPassengers().getAdult();
            int numChildren = request.getPassengers().getChild();
            int numInfants = request.getPassengers().getInfant();

            List<PassengerDetailDTO> details = request.getPassengerDetails() != null ? request.getPassengerDetails() : new ArrayList<>();
            int adultIdx = 1;
            for (PassengerDetailDTO detail : details) {
                if ("adult".equals(detail.getPassengerType()) && adultIdx < numAdults) {
                    BookingPassengerDTO adult = BookingPassengerDTO.builder()
                        .bookingId(booking.getBookingId())
                        .publicId(user.getPublicId())
                        .fullName(detail.getFullName())
                        .passengerType("adult")
                        .gender(detail.getGender())
                        .birthDate(detail.getBirthDate())
                        .phone(detail.getPhone())
                        .email(detail.getEmail())
                        // .address(detail.getAddress())
                        .build();
                    BookingPassengerDTO saved = create(adult);
                    createdPassengers.add(saved);
                    adultPassengerIds.add(saved.getPassengerId());
                    adultIdx++;
                }
            }

            // 3. Tạo trẻ em/em bé, mapping guardianIndex sang passengerId
            for (PassengerDetailDTO detail : details) {
                if (!"adult".equals(detail.getPassengerType())) {
                    Integer guardianIndex = detail.getGuardianIndex(); // FE gửi lên
                    Integer guardianPassengerId = (guardianIndex != null && guardianIndex < adultPassengerIds.size())
                        ? adultPassengerIds.get(guardianIndex)
                        : null;
                    BookingPassengerDTO child = BookingPassengerDTO.builder()
                        .bookingId(booking.getBookingId())
                        .publicId(user.getPublicId())
                        .fullName(detail.getFullName())
                        .passengerType(detail.getPassengerType())
                        .gender(detail.getGender())
                        .birthDate(detail.getBirthDate())
                        .guardianPassengerId(guardianPassengerId)
                        .build();
                    createdPassengers.add(create(child));
                }
            }

            // Lấy giá đã được giảm từ booking hiện tại
            BigDecimal discountedBasePrice = booking.getTotalPrice();
            int adults = request.getPassengers().getAdult();
            int children = request.getPassengers().getChild();
            int infants = request.getPassengers().getInfant();

            // Tính toán lại tổng giá dựa trên giá đã giảm
            BigDecimal totalPrice = discountedBasePrice
                    .multiply(BigDecimal.valueOf(adults))
                    .add(discountedBasePrice.multiply(BigDecimal.valueOf(0.5)).multiply(BigDecimal.valueOf(children)))
                    .add(discountedBasePrice.multiply(BigDecimal.valueOf(0.25)).multiply(BigDecimal.valueOf(infants)));

            log.info("Calculating total price:");
            log.info("Discounted base price: {}", discountedBasePrice);
            log.info("Adults ({}): {}", adults, discountedBasePrice.multiply(BigDecimal.valueOf(adults)));
            log.info("Children ({}): {}", children,
                    discountedBasePrice.multiply(BigDecimal.valueOf(0.5)).multiply(BigDecimal.valueOf(children)));
            log.info("Infants ({}): {}", infants,
                    discountedBasePrice.multiply(BigDecimal.valueOf(0.25)).multiply(BigDecimal.valueOf(infants)));
            log.info("Total price: {}", totalPrice);

            // Nếu có discountedPrice từ request, ưu tiên cập nhật giá booking bằng giá đã giảm
            if (request.getDiscountedPrice() != null && request.getDiscountedPrice() > 0) {
                booking.setTotalPrice(BigDecimal.valueOf(request.getDiscountedPrice()));
                // Cập nhật discount_code và discount_id nếu có
                if (request.getDiscountCode() != null && !request.getDiscountCode().isBlank()) {
                    Discount discount = discountRepo.findByCode(request.getDiscountCode()).orElse(null);
                    if (discount != null) {
                        booking.setDiscountCode(discount.getCode());
                        booking.setDiscountId(discount.getDiscountId());
                    }
                }
            } else {
                booking.setTotalPrice(totalPrice);
            }
            bookingRepo.save(booking);

            return createdPassengers;
        } catch (Exception e) {
            log.error("Error creating passengers: ", e);
            e.printStackTrace();
            throw new RuntimeException("Failed to create passengers: " + e.getMessage());
        }
    }

    private void validateRequest(BookingPassengerRequestDTO request) {
        List<String> errors = new ArrayList<>();
        if (request == null || request.getBookingId() == null || request.getPublicId() == null
                || request.getContactInfo() == null) {
            throw new IllegalArgumentException("Missing required booking, user or contact info");
        }
        if (request.getContactInfo().getFullName() == null || request.getContactInfo().getFullName().trim().isEmpty()) {
            errors.add("Contact name is required");
        }
        if (request.getContactInfo().getEmail() == null || request.getContactInfo().getEmail().trim().isEmpty()) {
            errors.add("Contact email is required");
        }
        if (request.getContactInfo().getPhoneNumber() == null
                || request.getContactInfo().getPhoneNumber().trim().isEmpty()) {
            errors.add("Contact phone number is required");
        }
        if (request.getPassengers() == null || request.getPassengers().getAdult() < 1) {
            errors.add("At least one adult passenger is required");
        }
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: " + String.join(", ", errors));
        }
    }

    private BookingPassengerDTO createContactPassenger(BookingPassengerRequestDTO request, Integer bookingId,
            String publicId) {
        return create(
                BookingPassengerDTO.builder()
                        .bookingId(bookingId)
                        .publicId(publicId)
                        .fullName(request.getContactInfo().getFullName())
                        .phone(request.getContactInfo().getPhoneNumber())
                        .email(request.getContactInfo().getEmail())
                        .address(request.getContactInfo().getAddress())
                        .gender(request.getContactInfo().getGender())
                        .birthDate(request.getContactInfo().getBirthDate())
                        .passengerType("adult")
                        .build());
    }

    private BookingPassenger mapToEntity(BookingPassengerDTO dto) {
        log.info("DTO gender={}, birthDate={}", dto.getGender(), dto.getBirthDate());
        String address = dto.getAddress();
        BookingPassenger.BookingPassengerBuilder builder = BookingPassenger.builder()
                .booking(bookingRepo.findById(dto.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Booking not found")))
                .user(userRepo.findByPublicId(dto.getPublicId())
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(address != null && address.trim().isEmpty() ? null : address)
                .gender(dto.getGender())
                .birthDate(dto.getBirthDate())
                .passengerType(BookingPassenger.PassengerType.valueOf(dto.getPassengerType().toLowerCase()));
        // Set guardianPassenger nếu có
        if (dto.getGuardianPassengerId() != null) {
            BookingPassenger guardian = bookingPassengerRepo.findById(dto.getGuardianPassengerId())
                    .orElse(null);
            builder.guardianPassenger(guardian);
        }
        return builder.build();
    }

    private BookingPassengerDTO mapToDTO(BookingPassenger p) {
        return BookingPassengerDTO.builder()
                .passengerId(p.getPassengerId())
                .bookingId(p.getBooking().getBookingId())
                .publicId(p.getUser().getPublicId())
                .fullName(p.getFullName())
                .phone(p.getPhone())
                .email(p.getEmail())
                .address(p.getAddress())
                .gender(p.getGender())
                .birthDate(p.getBirthDate())
                .passengerType(p.getPassengerType().name())
                .guardianPassengerId(p.getGuardianPassenger() != null ? p.getGuardianPassenger().getPassengerId() : null)
                .build();
    }
}
