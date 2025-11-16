package com.FSP.BackEnd.controller;

import com.FSP.BackEnd.repository.FileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<String> healthCheck() {
        // Always return 200 OK, minimal check
        return ResponseEntity.ok("Backend container ready");
    }

}

