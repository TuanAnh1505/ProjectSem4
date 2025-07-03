package com.example.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import com.example.api.repository.MediaRepository;
import com.example.api.model.Media;
import com.example.api.model.User;
import com.example.api.repository.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/api/media")
public class MediaController {
    @Autowired
    private MediaRepository mediaRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Media uploadMedia(
        @RequestParam("file") MultipartFile file,
        @RequestParam("userid") Long userid,
        @RequestParam("experienceId") Long experienceId,
        @RequestParam("fileType") String fileType
    ) throws IOException {
      
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get("uploads/media", fileName);
        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath);

        
        User user = userRepo.findById(userid).orElseThrow();

        
        Media media = new Media();
        media.setUser(user);
        media.setExperienceId(experienceId);
        media.setFileType(fileType);
        media.setFileUrl("/uploads/media/" + fileName);
        return mediaRepo.save(media);
    }

    @GetMapping
    public List<Media> getAllMedia() {
        return mediaRepo.findAll();
    }
}
