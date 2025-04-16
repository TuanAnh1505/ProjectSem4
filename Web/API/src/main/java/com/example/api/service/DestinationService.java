package com.example.api.service;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;
    public DestinationDTO createDestination(DestinationDTO destinationDTO) {
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
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        updateEntityFromDTO(destination, destinationDTO);
        Destination updatedDestination = destinationRepository.save(destination);
        return mapToDTO(updatedDestination);
    }
    public void deleteDestination(Integer id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        destinationRepository.delete(destination);
    }
    private Destination mapToEntity(DestinationDTO dto) {
        Destination destination = new Destination();
        destination.setDestinationid(dto.getDestinationid());
        destination.setName(dto.getName());
        destination.setCategory(dto.getCategory());
        destination.setDescription(dto.getDescription());
        destination.setLocation(dto.getLocation());
        destination.setRating(dto.getRating());
        if (dto.getFiletype() != null) {
            destination.setFiletype(Destination.FileType.valueOf(dto.getFiletype()));
        }
        destination.setCreatedat(LocalDateTime.now());
        return destination;
    }
    private DestinationDTO mapToDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDestinationid(destination.getDestinationid());
        dto.setName(destination.getName());
        dto.setCategory(destination.getCategory());
        dto.setDescription(destination.getDescription());
        dto.setLocation(destination.getLocation());
        dto.setRating(destination.getRating());

        if (destination.getFiletype() != null) {
            dto.setFiletype(destination.getFiletype().name());
        }
        return dto;
    }
    private void updateEntityFromDTO(Destination destination, DestinationDTO dto) {
        destination.setName(dto.getName());
        destination.setCategory(dto.getCategory());
        destination.setDescription(dto.getDescription());
        destination.setLocation(dto.getLocation());
        destination.setRating(dto.getRating());
        if (dto.getFiletype() != null) {
            destination.setFiletype(Destination.FileType.valueOf(dto.getFiletype()));
        }

    }
}