package com.maisontia.api.controller;

import com.maisontia.api.dto.LoginRequest;
import com.maisontia.api.security.InputSanitizer;
import com.maisontia.api.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"https://www.maisontia.com", "http://localhost:5173"})
public class AuthController {

    private static final String ADMIN_USERNAME;
    private static final String ADMIN_PASSWORD;

    static {
        String envUser = System.getenv("ADMIN_USERNAME");
        ADMIN_USERNAME = (envUser != null && !envUser.isBlank()) ? envUser : "admin";

        String envPass = System.getenv("ADMIN_PASSWORD");
        if (envPass == null || envPass.isBlank()) {
            System.err.println("⚠️  ADMIN_PASSWORD non défini ! L'authentification admin sera impossible en production.");
            ADMIN_PASSWORD = "";
        } else {
            ADMIN_PASSWORD = envPass;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String sanitizedUsername = InputSanitizer.sanitize(request.getUsername());
        String rawPassword = request.getPassword();

        if (sanitizedUsername == null || rawPassword == null || ADMIN_PASSWORD.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Identifiants invalides"
            ));
        }

        if (ADMIN_USERNAME.equals(sanitizedUsername) && ADMIN_PASSWORD.equals(rawPassword)) {
            String token = JwtUtils.generateToken(sanitizedUsername);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", "ROLE_ADMIN",
                    "expiresIn", 86400
            ));
        }

        return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "Identifiants invalides"
        ));
    }
}


