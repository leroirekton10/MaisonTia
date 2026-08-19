package com.maisontia.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.security.Key;
import java.util.logging.Logger;

public class JwtUtils {
    private static final Logger LOGGER = Logger.getLogger(JwtUtils.class.getName());
    private static final long EXPIRATION_TIME = 86400000; // 24h

    private static final String SECRET;

    static {
        String envSecret = System.getenv("JWT_SECRET");
        if (envSecret == null || envSecret.isBlank()) {
            LOGGER.warning("⚠️  JWT_SECRET non défini ! Utilisation d'une clé temporaire. "
                    + "Définissez JWT_SECRET en production (min 64 caractères).");
            // Generate a random fallback for local dev only
            envSecret = java.util.UUID.randomUUID().toString()
                    + java.util.UUID.randomUUID().toString();
        }
        SECRET = envSecret;
    }

    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public static String validateTokenAndGetUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}

