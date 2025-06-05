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
        BookingPassenger passenger = mapToEntity(dto);
        return mapToDTO(bookingPassengerRepo.save(passenger));
    }

    public BookingPassengerDTO update(Integer id, BookingPassengerDTO dto) {
        BookingPassenger existing = bookingPassengerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setEmail(dto.getEmail());
        existing.setAddress(dto.getAddress());
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

    public List<BookingPassengerDTO> createPassengers(BookingPassengerRequestDTO request) {
        log.info("Received booking passenger request: {}", request);
        validateRequest(request);
        List<BookingPassengerDTO> createdPassengers = new ArrayList<>();

        try {
            Booking booking = bookingRepo.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + request.getBookingId()));
            User user = userRepo.findByPublicId(request.getPublicId())
                    .orElseThrow(() -> new RuntimeException("User not found with publicId: " + request.getPublicId()));

            // Luôn tạo contactPassenger cho người lớn 1
            BookingPassengerDTO contactPassenger = createContactPassenger(request, booking.getBookingId(),
                    user.getPublicId());
            createdPassengers.add(contactPassenger);

            // Chỉ tạo thêm hành khách nếu có nhiều hơn 1 người lớn hoặc có trẻ em/em bé
            int numAdults = request.getPassengers().getAdult();
            int numChildren = request.getPassengers().getChild();
            int numInfants = request.getPassengers().getInfant();
            if ((numAdults > 1 || numChildren > 0 || numInfants > 0) && request.getPassengerDetails() != null) {
                // Nếu có nhiều hơn 1 người lớn, chỉ lấy các người lớn 2 trở đi từ
                // passengerDetails
                List<PassengerDetailDTO> filteredDetails = new ArrayList<>();
                int expectedAdults = numAdults > 1 ? numAdults - 1 : 0;
                int countAdults = 0;
                for (PassengerDetailDTO detail : request.getPassengerDetails()) {
                    if ("adult".equals(detail.getPassengerType())) {
                        if (countAdults < expectedAdults) {
                            filteredDetails.add(detail);
                            countAdults++;
                        }
                    } else {
                        filteredDetails.add(detail);
                    }
                }
                // Tạo các hành khách bổ sung
                for (PassengerDetailDTO detail : filteredDetails) {
                    log.info("Passenger detail: fullName={}, gender={}, birthDate={}, type={}", detail.getFullName(),
                            detail.getGender(), detail.getBirthDate(), detail.getPassengerType());
                    BookingPassengerDTO passenger = BookingPassengerDTO.builder()
                            .bookingId(booking.getBookingId())
                            .publicId(user.getPublicId())
                            .fullName(detail.getFullName())
                            .passengerType(detail.getPassengerType())
                            .gender(detail.getGender())
                            .birthDate(detail.getBirthDate())
                            .build();
                    createdPassengers.add(create(passenger));
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
        return BookingPassenger.builder()
                .booking(bookingRepo.findById(dto.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Booking not found")))
                .user(userRepo.findByPublicId(dto.getPublicId())
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .gender(dto.getGender())
                .birthDate(dto.getBirthDate())
                .passengerType(BookingPassenger.PassengerType.valueOf(dto.getPassengerType().toLowerCase()))
                .build();
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
                .build();
    }
}
