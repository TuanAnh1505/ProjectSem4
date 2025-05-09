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
            response.put("message", "Booking successful");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
