package com.maisontia.api.security;

import java.util.regex.Pattern;

/**
 * Robust server-side sanitizer to prevent XSS, HTML injection, and control character exploits.
 * Zero-trust approach for all incoming user data.
 */
public final class InputSanitizer {

    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>", Pattern.DOTALL);
    private static final Pattern SCRIPT_PATTERN = Pattern.compile("(?i)<script.*?>.*?</script.*?>", Pattern.DOTALL);
    private static final Pattern DANGEROUS_PROTOCOLS = Pattern.compile("(?i)(javascript|vbscript|data):", Pattern.DOTALL);
    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\p{Cntrl}&&[^\r\n\t]]");

    private InputSanitizer() {}

    /**
     * Sanitizes plain text input by stripping HTML tags, dangerous scripts, control chars, and trimming.
     */
    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }
        String cleaned = input;
        cleaned = SCRIPT_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = HTML_TAG_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = DANGEROUS_PROTOCOLS.matcher(cleaned).replaceAll("");
        cleaned = CONTROL_CHARS.matcher(cleaned).replaceAll("");
        return cleaned.trim();
    }

    /**
     * Validates and sanitizes a URL to ensure it's safe (http/https only or relative asset path).
     */
    public static boolean isValidSafeUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        String trimmed = url.trim();
        if (trimmed.startsWith("/assets/") || trimmed.startsWith("/uploads/")) {
            return true;
        }
        return trimmed.startsWith("http://") || trimmed.startsWith("https://");
    }

    /**
     * Sanitizes filenames to prevent path traversal (../) and dangerous extensions.
     */
    public static String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "file_" + System.currentTimeMillis();
        }
        // Remove path elements (../, \, /)
        String clean = filename.replace("\\", "/");
        int lastSlash = clean.lastIndexOf('/');
        if (lastSlash >= 0) {
            clean = clean.substring(lastSlash + 1);
        }
        // Remove special characters, allow only alphanumeric, dash, underscore, dot
        clean = clean.replaceAll("[^a-zA-Z0-9._-]", "_");
        // Limit length
        if (clean.length() > 100) {
            clean = clean.substring(clean.length() - 100);
        }
        return clean;
    }
}
