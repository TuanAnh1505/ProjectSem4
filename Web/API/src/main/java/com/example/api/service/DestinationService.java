package com.example.api.service;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    private final String uploadDir = "uploads/destinations/";
    private final Set<String> allowedExtensions = Set.of("jpg", "jpeg", "png", "mp4", "mov");

    public DestinationDTO createDestination(DestinationDTO destinationDTO, List<MultipartFile> files) {
        try {
            // Create directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Process and save files
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null) {
                    throw new IllegalArgumentException("File name cannot be null");
                }

                String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                String newFilename = UUID.randomUUID().toString() + extension;
                Path targetPath = Paths.get(uploadDir, newFilename);

                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                filePaths.add("/uploads/destinations/" + newFilename);
            }

            // Create and save destination
            destinationDTO.setFilePaths(filePaths);
            Destination destination = mapToEntity(destinationDTO);
            Destination savedDestination = destinationRepository.save(destination);
            return mapToDTO(savedDestination);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    public DestinationDTO getDestinationById(Integer id) {
        return destinationRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
    }

    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DestinationDTO updateDestination(Integer id, DestinationDTO destinationDTO) {
        if (destinationDTO.getName() == null || destinationDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (destinationDTO.getCategory() == null || destinationDTO.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        return destinationRepository.findById(id)
                .map(destination -> {
                    updateEntityFromDTO(destination, destinationDTO);
                    Destination updatedDestination = destinationRepository.save(destination);
                    return mapToDTO(updatedDestination);
                })
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
    }

    public DestinationDTO updateDestination(Integer id, DestinationDTO destinationDTO, List<MultipartFile> files) {
        return destinationRepository.findById(id)
                .map(destination -> {
                    // Update basic fields
                    updateEntityFromDTO(destination, destinationDTO);

                    // Handle file updates if present
                    if (files != null && !files.isEmpty()) {
                        try {
                            List<String> filePaths = new ArrayList<>();
                            File directory = new File(uploadDir);
                            if (!directory.exists()) {
                                directory.mkdirs();
                            }

                            for (MultipartFile file : files) {
                                String originalFilename = file.getOriginalFilename();
                                String newFilename = UUID.randomUUID().toString() +
                                        originalFilename.substring(originalFilename.lastIndexOf('.'));
                                Path targetPath = Paths.get(uploadDir, newFilename);
                                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                                filePaths.add("/uploads/destinations/" + newFilename);
                            }

                            // Keep existing files if no new ones uploaded
                            if (!filePaths.isEmpty()) {
                                destination.setFilePaths(filePaths);
                            }
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to store file", e);
                        }
                    }

                    Destination updatedDestination = destinationRepository.save(destination);
                    return mapToDTO(updatedDestination);
                })
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
    }

    public boolean deleteDestination(Integer id) {
        if (destinationRepository.existsById(id)) {
            destinationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private DestinationDTO mapToDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDestinationId(destination.getDestinationId());
        dto.setName(destination.getName());
        dto.setCategory(destination.getCategory());
        dto.setFilePaths(destination.getFilePaths());
        dto.setDescription(destination.getDescription());
        dto.setLocation(destination.getLocation());
        dto.setRating(destination.getRating());
        return dto;
    }

    private void updateEntityFromDTO(Destination destination, DestinationDTO dto) {
        destination.setName(dto.getName());
        destination.setCategory(dto.getCategory());
        destination.setFilePaths(dto.getFilePaths());
        destination.setDescription(dto.getDescription());
        destination.setLocation(dto.getLocation());
        destination.setRating(dto.getRating());
    }

    private Destination mapToEntity(DestinationDTO dto) {
        Destination destination = new Destination();
        destination.setName(dto.getName());
        destination.setCategory(dto.getCategory());
        destination.setFilePaths(dto.getFilePaths());
        destination.setDescription(dto.getDescription());
        destination.setLocation(dto.getLocation());
        destination.setRating(dto.getRating());
        return destination;
    }
}