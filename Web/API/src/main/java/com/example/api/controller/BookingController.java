package com.example.api.controller;

import com.example.api.dto.TourBookingRequest;
import com.example.api.model.Booking;
import com.example.api.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> bookTour(@RequestBody TourBookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            Map<String, Object> response = new HashMap<>();
            response.put("bookingId", booking.getBookingId());
            response.put("bookingCode", booking.getBookingCode());
            response.put("finalPrice", booking.getTotalPrice());
            response.put("message", "Booking successful");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/admin-bookings")
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/admin-bookings/{id}")
    public ResponseEntity<?> getBookingDetail(@PathVariable Integer id) {
        try {
            Map<String, Object> data = bookingService.getBookingDetail(id);
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<?> getBookingDetailForUser(@PathVariable Integer id) {
        try {
            Map<String, Object> data = bookingService.getBookingDetail(id);
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/user/{publicId}")
    public ResponseEntity<?> getBookingsByUserPublicId(@PathVariable String publicId) {
        try {
            return ResponseEntity.ok(bookingService.getBookingsByUserPublicId(publicId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
