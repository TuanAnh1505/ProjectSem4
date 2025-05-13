package com.example.api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private  final String uploadDir = "uploads/";

    public FileStorageService(){
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

    }
    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());
        return filePath.toString();
    }
    public  void deleteFile(String fileUrl)throws IOException{
        if(fileUrl !=null){
            Path filePath = Paths.get(fileUrl);
            Files.deleteIfExists(filePath);
        }
    }
}