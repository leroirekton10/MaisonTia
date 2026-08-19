package com.maisontia.api.controller;

import com.maisontia.api.dto.LoginRequest;
import com.maisontia.api.security.InputSanitizer;
import com.maisontia.api.security.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
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
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
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

            // Création d'un Cookie HTTP-Only, Secure, SameSite=Strict (Protection XSS totale)
            ResponseCookie cookie = ResponseCookie.from("adminToken", token)
                    .httpOnly(true)
                    .secure(false) // Mettre true derrière un reverse proxy HTTPS / production
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(86400) // 24 heures
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "role", "ROLE_ADMIN",
                    "username", sanitizedUsername,
                    "token", token, // Pour compatibilité rétroactive API
                    "expiresIn", 86400
            ));
        }

        return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "Identifiants invalides"
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "username", authentication.getName(),
                    "role", "ROLE_ADMIN"
            ));
        }
        return ResponseEntity.status(401).body(Map.of("authenticated", false, "message", "Non connecté"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Suppression du cookie HTTP-Only
        ResponseCookie cookie = ResponseCookie.from("adminToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }
}
