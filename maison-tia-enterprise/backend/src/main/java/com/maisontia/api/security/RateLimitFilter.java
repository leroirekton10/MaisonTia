package com.maisontia.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Server-side Rate Limiting Filter.
 * Enforces max 5 attempts per minute per IP on authentication and sensitive endpoints.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_MS = 60 * 1000L; // 1 minute

    private final ConcurrentHashMap<String, ConcurrentLinkedQueue<Long>> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Appliquer le rate limit strict sur les endpoints d'authentification et d'administration
        if (path.startsWith("/api/auth") || path.startsWith("/api/admin")) {
            String clientIp = getClientIp(request);
            String key = clientIp + ":" + (path.startsWith("/api/auth") ? "auth" : "admin");

            long now = System.currentTimeMillis();
            ConcurrentLinkedQueue<Long> timestamps = requestCounts.computeIfAbsent(key, k -> new ConcurrentLinkedQueue<>());

            // Nettoyage des requêtes en dehors de la fenêtre
            timestamps.removeIf(time -> now - time > WINDOW_MS);

            if (timestamps.size() >= MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.setHeader("Retry-After", "60");
                response.getWriter().write("{"
                        + "\"timestamp\":\"" + java.time.LocalDateTime.now() + "\","
                        + "\"status\":429,"
                        + "\"error\":\"Too Many Requests\","
                        + "\"message\":\"Limite de requêtes atteinte (Max 5 tentatives par minute). Veuillez patienter 60 secondes.\""
                        + "}");
                return;
            }

            timestamps.add(now);
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
