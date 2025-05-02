package com.example.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.api.dto.EventDTO;
import com.example.api.model.EventStatus;
import com.example.api.repository.EventStatusRepository;
import com.example.api.service.EventService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventStatusRepository eventStatusRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Thêm sự kiện
    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@Valid @ModelAttribute EventDTO eventDTO,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {
        if (files != null && !files.isEmpty()) {
            List<String> filePaths = saveFiles(files);
            eventDTO.setFilePaths(filePaths);
        }
        return ResponseEntity.ok(eventService.createEvent(eventDTO));
    }

    // Sửa sự kiện
    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Integer id, @Valid @ModelAttribute EventDTO eventDTO,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {
        if (files != null && !files.isEmpty()) {
            // Xóa file cũ
            EventDTO existingEvent = eventService.getEventById(id);
            if (existingEvent.getFilePaths() != null) {
                existingEvent.getFilePaths().forEach(filePath -> {
                    try {
                        Files.deleteIfExists(Paths.get(filePath));
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to delete old file: " + filePath, e);
                    }
                });
            }
            // Lưu file mới
            List<String> filePaths = saveFiles(files);
            eventDTO.setFilePaths(filePaths);
        }
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO));
    }

    // Xóa sự kiện
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // Lấy danh sách sự kiện
    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Lấy sự kiện theo ID
    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Integer id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // Phục vụ file
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir, fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/event-statuses")
    public ResponseEntity<List<EventStatus>> getAllEventStatuses() {
        List<EventStatus> statuses = eventStatusRepository.findAll();
        return ResponseEntity.ok(statuses);
    }

    // Lưu file và trả về danh sách đường dẫn
    private List<String> saveFiles(List<MultipartFile> files) throws IOException {
        List<String> filePaths = new ArrayList<>();
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String contentType = file.getContentType();
                if (!List.of("image/jpeg", "image/png", "video/mp4").contains(contentType)) {
                    throw new IllegalArgumentException("Unsupported file type: " + contentType);
                }
                if (file.getSize() > 10 * 1024 * 1024) { // 10MB
                    throw new IllegalArgumentException("File size exceeds 10MB");
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.write(filePath, file.getBytes());
                // Store relative path instead of absolute path
                filePaths.add("/uploads/events/" + fileName);
            }
        }
        return filePaths;
    }
}