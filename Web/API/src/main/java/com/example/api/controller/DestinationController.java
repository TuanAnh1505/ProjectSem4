package com.example.api.controller;

import com.example.api.dto.DestinationDTO;
import com.example.api.service.DestinationService;
import com.example.api.service.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private static final Logger logger = LoggerFactory.getLogger(DestinationController.class);

    @Autowired
    private DestinationService destinationService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<DestinationDTO> createDestination(
            @RequestPart("destination") String destinationJson,
            @RequestPart(value = "file", required = false) MultipartFile file) throws Exception {
        logger.info("Received createDestination request. Destination JSON: {}", destinationJson);
        logger.info("File received: {}", file != null ? file.getOriginalFilename() : "null");

        // Chuyển đổi JSON thành DestinationDTO
        ObjectMapper objectMapper = new ObjectMapper();
        DestinationDTO destinationDTO = objectMapper.readValue(destinationJson, DestinationDTO.class);

        // Xác thực dữ liệu
        validateDestinationDTO(destinationDTO);

        // Xử lý file nếu có
        if (file != null && !file.isEmpty()) {
            logger.info("Processing file: {}", file.getOriginalFilename());
            String fileUrl = fileStorageService.storeFile(file);
            destinationDTO.setFileUrl(fileUrl);

            // Kiểm tra và set fileType
            String contentType = file.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("image")) {
                    destinationDTO.setFileType("image");
                } else if (contentType.startsWith("video")) {
                    destinationDTO.setFileType("video");
                } else {
                    throw new IllegalArgumentException("Unsupported file type. Only images and videos are allowed.");
                }
            }
        } else {
            logger.warn("No file uploaded or file is empty.");
        }

        DestinationDTO createdDestination = destinationService.createDestination(destinationDTO);
        return ResponseEntity.ok(createdDestination);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO> getDestinationById(@PathVariable Integer id) {
        DestinationDTO destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(destination);
    }

    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        List<DestinationDTO> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<DestinationDTO> updateDestination(
            @PathVariable Integer id,
            @RequestPart("destination") String destinationJson,
            @RequestPart(value = "file", required = false) MultipartFile file) throws Exception {
        logger.info("Received updateDestination request for ID: {}. Destination JSON: {}", id, destinationJson);
        logger.info("File received: {}", file != null ? file.getOriginalFilename() : "null");

        // Chuyển đổi JSON thành DestinationDTO
        ObjectMapper objectMapper = new ObjectMapper();
        DestinationDTO destinationDTO = objectMapper.readValue(destinationJson, DestinationDTO.class);

        // Xác thực dữ liệu
        validateDestinationDTO(destinationDTO);

        // Xử lý file nếu có
        if (file != null && !file.isEmpty()) {
            logger.info("Processing file: {}", file.getOriginalFilename());
            String fileUrl = fileStorageService.storeFile(file);
            destinationDTO.setFileUrl(fileUrl);

            // Kiểm tra và set fileType
            String contentType = file.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("image")) {
                    destinationDTO.setFileType("image");
                } else if (contentType.startsWith("video")) {
                    destinationDTO.setFileType("video");
                } else {
                    throw new IllegalArgumentException("Unsupported file type. Only images and videos are allowed.");
                }
            }
        } else {
            logger.warn("No file uploaded or file is empty for update.");
        }

        DestinationDTO updatedDestination = destinationService.updateDestination(id, destinationDTO);
        return ResponseEntity.ok(updatedDestination);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Integer id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }

    private void validateDestinationDTO(DestinationDTO destinationDTO) {
        if (destinationDTO.getName() == null || destinationDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (destinationDTO.getCategory() == null || destinationDTO.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        if (destinationDTO.getRating() != null && (destinationDTO.getRating() < 0 || destinationDTO.getRating() > 5)) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
    }
}
