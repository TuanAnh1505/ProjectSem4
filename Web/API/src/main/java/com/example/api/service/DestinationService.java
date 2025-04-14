package com.example.api.service;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    // CREATE
    public Destination createDestination(DestinationDTO destinationDTO) {
        Destination destination = new Destination();
        mapDtoToEntity(destinationDTO, destination);
        return destinationRepository.save(destination);
    }

    // READ all
    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    // READ by ID
    public Optional<DestinationDTO> getDestinationById(Integer id) {
        return destinationRepository.findById(id)
                .map(this::mapEntityToDto);
    }

    // UPDATE
    public DestinationDTO updateDestination(Integer id, DestinationDTO destinationDTO) {
        Optional<Destination> existingDestination = destinationRepository.findById(id);
        if (existingDestination.isPresent()) {
            Destination destination = existingDestination.get();
            mapDtoToEntity(destinationDTO, destination);
            Destination updatedDestination = destinationRepository.save(destination);
            return mapEntityToDto(updatedDestination);
        } else {
            throw new RuntimeException("Destination not found with id: " + id);
        }
    }

    // DELETE
    public void deleteDestination(Integer id) {
        if (destinationRepository.existsById(id)) {
            destinationRepository.deleteById(id);
        } else {
            throw new RuntimeException("Destination not found with id: " + id);
        }
    }
    private void mapDtoToEntity(DestinationDTO dto, Destination entity) {
        entity.setName(dto.getName());
        entity.setCategory(dto.getCategory());
        entity.setFileType(Destination.FileType.valueOf(dto.getFileType()));
        entity.setDescription(dto.getDescription());
        entity.setLocation(dto.getLocation());
        entity.setRating(dto.getRating());
    }
    private DestinationDTO mapEntityToDto(Destination entity) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDestinationId(entity.getDestinationId());
        dto.setName(entity.getName());
        dto.setCategory(entity.getCategory());
        dto.setFileType(entity.getFileType().name());
        dto.setDescription(entity.getDescription());
        dto.setLocation(entity.getLocation());
        dto.setRating(entity.getRating());
        return dto;
    }
}
