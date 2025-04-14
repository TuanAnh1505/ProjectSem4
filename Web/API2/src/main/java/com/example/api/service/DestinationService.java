package com.example.api.service;

import com.example.api.dto.DestinationDTO;
import com.example.api.model.Destination;
import com.example.api.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {
    @Autowired
    private DestinationRepository destinationRepository;
    //Create
    public DestinationDTO createDestination(DestinationDTO destinationDTO) {
        Destination destination = new Destination();
        mapToEntity(destinationDTO,destination);
        Destination savedDestination = destinationRepository.save(destination);
        return mapToDTO(savedDestination);
    }
    //Get by ID
    public DestinationDTO getDestinationById(int id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Destination not found"));
        return mapToDTO(destination);
    }
    //Get all
    public List<DestinationDTO> getAllDestinations() {
        return  destinationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    //Update
    public DestinationDTO updateDestination(int id, DestinationDTO destinationDTO) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Destination not found"));
        mapToEntity(destinationDTO,destination);
        Destination updatedDestination = destinationRepository.save(destination);
        return mapToDTO(updatedDestination);
    }
    //Delete
    public  void deleteDestination(int id) {
        if(!destinationRepository.existsById(id)) {
            throw new RuntimeException("Destination not found");
        }
        destinationRepository.deleteById(id);
    }
    private  void mapToEntity(DestinationDTO dto, Destination entity) {
        entity.setName(dto.getName());
        entity.setCategory(dto.getCategory());
        entity.setFileType(dto.getFileType());
        entity.setDescription(dto.getDescription());
        entity.setLocation(entity.getLocation());
        entity.setRating(dto.getRating());
    }
    private DestinationDTO mapToDTO(Destination entity) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDestinationId(entity.getDestinationId());
        dto.setName(entity.getName());
        dto.setCategory(entity.getCategory());
        dto.setFileType(entity.getFileType());
        dto.setDescription(entity.getDescription());
        dto.setLocation(entity.getLocation());
        dto.setRating(entity.getRating());
        dto.setCreatedAt(entity.getCreatedAt() != null
                    ? entity.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                :null);
        return dto;
    }
}
