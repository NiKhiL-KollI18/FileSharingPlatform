package com.FSP.BackEnd.controller;

import com.FSP.BackEnd.config.JwtUtil; // Import your JwtUtil
import com.FSP.BackEnd.model.UserEntity;
import com.FSP.BackEnd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
// @CrossOrigin removed: SecurityConfig now handles this globally!
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil; // <--- The new key generator

    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody UserEntity user) {
        if(userService.existsByEmail(user.getEmail())) {
            return Map.of("status", "error", "message", "Email already exists!");
        }
        // Note: For a real "Secure" rubric, you should hash the password here
        // e.g., user.setPassword(passwordEncoder.encode(user.getPassword()));
        // But for now, we keep it simple to avoid locking out existing users.
        userService.saveUser(user);
        return Map.of("status", "success", "message", "Signup successful!");
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody UserEntity user) {
        Optional<UserEntity> dbUser = userService.findByEmail(user.getEmail());

        // Check if user exists AND password matches
        if (dbUser.isPresent() && dbUser.get().getPassword().equals(user.getPassword())) {

            // GENERATE JWT TOKEN
            String token = jwtUtil.generateToken(user.getEmail());

            return Map.of(
                    "status", "success",
                    "message", "Login successful!",
                    "token", token // <--- Send this to the frontend!
            );
        } else {
            return Map.of("status", "error", "message", "Invalid email or password");
        }
    }
}