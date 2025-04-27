package com.example.api.service;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private FileStorageService fileStorageService;


    public DestinationDTO createDestination(DestinationDTO destinationDTO) {
        if (destinationDTO.getName() == null || destinationDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (destinationDTO.getCategory() == null || destinationDTO.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        Destination destination = mapToEntity(destinationDTO);
        Destination savedDestination = destinationRepository.save(destination);
        return mapToDTO(savedDestination);
    }

    public DestinationDTO getDestinationById(Integer id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        return mapToDTO(destination);
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
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        if (destination.getFileUrl() != null && destinationDTO.getFileUrl() != null && !destination.getFileUrl().equals(destinationDTO.getFileUrl())) {
            try {
                fileStorageService.deleteFile(destination.getFileUrl());
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete old file: " + e.getMessage());
            }
        }
        updateEntityFromDTO(destination, destinationDTO);
        Destination updatedDestination = destinationRepository.save(destination);
        return mapToDTO(updatedDestination);
    }

    public void deleteDestination(Integer id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        if(destination.getFileUrl()!= null){
            try {
                fileStorageService.deleteFile(destination.getFileUrl());
            }catch (Exception e){
                throw new RuntimeException("File to delete file: " + e.getMessage());
            }
        }
        destinationRepository.delete(destination);
    }

    private Destination mapToEntity(DestinationDTO dto) {
        Destination destination = new Destination();
        destination.setDestinationId(dto.getDestinationId());
        destination.setName(dto.getName());
        destination.setCategory(dto.getCategory());
        if (dto.getFileType() != null) {
            destination.setFileType(Destination.FileType.valueOf(dto.getFileType()));
        }
        destination.setDescription(dto.getDescription());
        destination.setLocation(dto.getLocation());
        destination.setRating(dto.getRating());
        return destination;
    }

    private DestinationDTO mapToDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDestinationId(destination.getDestinationId());
        dto.setName(destination.getName());
        dto.setCategory(destination.getCategory());
        if (destination.getFileType() != null) {
            dto.setFileType(destination.getFileType().name());
        }
        dto.setDescription(destination.getDescription());
        dto.setLocation(destination.getLocation());
        dto.setRating(destination.getRating());
        return dto;
    }

    private void updateEntityFromDTO(Destination destination, DestinationDTO dto) {
        destination.setName(dto.getName());
        destination.setCategory(dto.getCategory());
        if (dto.getFileType() != null) {
            destination.setFileType(Destination.FileType.valueOf(dto.getFileType()));
        } else {
            destination.setFileType(null);
        }
        destination.setDescription(dto.getDescription());
        destination.setLocation(dto.getLocation());
        destination.setRating(dto.getRating());
    }
}
