package com.example.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.example.api.dto.BookingPassengerDTO;
import com.example.api.dto.BookingPassengerRequestDTO;
import com.example.api.service.BookingPassengerService;

import lombok.RequiredArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;



@RestController
@RequestMapping("/api/booking-passengers")
@RequiredArgsConstructor
public class BookingPassengerController {

    private final BookingPassengerService bookingPassengerService;

    @PostMapping
    public BookingPassengerDTO create(@RequestBody BookingPassengerDTO dto) {
        return bookingPassengerService.create(dto);
    }

    @PutMapping("/{id}")
    public BookingPassengerDTO update(@PathVariable Integer id, @RequestBody BookingPassengerDTO dto) {
        return bookingPassengerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        bookingPassengerService.delete(id);
    }

    @GetMapping("/{id}")
    public BookingPassengerDTO getById(@PathVariable Integer id) {
        return bookingPassengerService.getById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<BookingPassengerDTO> getByBookingId(@PathVariable Integer bookingId) {
        return bookingPassengerService.getByBookingId(bookingId);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitPassengers(@RequestBody BookingPassengerRequestDTO request) {
        try {
            List<BookingPassengerDTO> passengers = bookingPassengerService.createPassengers(request);
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse("Failed to create passengers: " + e.getMessage()));
        }
    }
}

@Data
@AllArgsConstructor
class ErrorResponse {
    private String message;
}
