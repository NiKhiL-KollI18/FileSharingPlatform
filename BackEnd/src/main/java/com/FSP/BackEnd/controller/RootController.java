package com.FSP.BackEnd.controller;

import com.FSP.BackEnd.repository.FileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    private final FileRepository fileRepository;

    // Constructor injection
    public RootController(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @GetMapping("/")
    public ResponseEntity<String> healthCheck() {
        try {
            long count = fileRepository.count(); // simple DB query
            return ResponseEntity.ok("Backend ready. Files: " + count);
        } catch (Exception e) {
            return ResponseEntity.status(503).body("DB not ready");
        }
    }

}
