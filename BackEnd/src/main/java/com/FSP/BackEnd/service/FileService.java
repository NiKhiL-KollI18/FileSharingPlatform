package com.FSP.BackEnd.service;

import com.FSP.BackEnd.model.FileEntity;
import com.FSP.BackEnd.repository.FileRepository;
import jakarta.servlet.http.HttpServletRequest; // use jakarta for Spring Boot 3+
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final String uploadDir = "uploads";
    private final String projectRoot = System.getProperty("user.dir");

    public FileService(FileRepository repo) {
        this.fileRepository = repo;
        File uploadDirectory = new File(projectRoot, uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }
    }

    public FileEntity saveFile(MultipartFile file) {
        String filePath = projectRoot + File.separator + uploadDir + File.separator + file.getOriginalFilename();
        try {
            file.transferTo(new File(filePath));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilename(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setSize(file.getSize());
        fileEntity.setPath(filePath);

        return fileRepository.save(fileEntity);
    }

    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }

    // Dynamic share link generation
    public FileEntity generateShareLink(Long fileId, HttpServletRequest request) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Dynamically build the full URL based on the request
        String link = ServletUriComponentsBuilder.fromRequestUri(request) // takes current host & protocol
                .replacePath("/files/share/" + file.getId())
                .toUriString();

        file.setShareLink(link);
        return fileRepository.save(file);
    }

    public void deleteFile(Long fileId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        new File(file.getPath()).delete();
        fileRepository.delete(file);
    }

    public FileEntity getFileById(Long fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with ID: " + fileId));
    }
}
