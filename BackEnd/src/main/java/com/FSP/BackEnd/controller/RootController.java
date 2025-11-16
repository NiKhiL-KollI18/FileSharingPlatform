package com.FSP.BackEnd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<String> healthCheck() {
        // Simple response for ELB health checks
        return ResponseEntity.ok("Backend is alive");
    }
}
