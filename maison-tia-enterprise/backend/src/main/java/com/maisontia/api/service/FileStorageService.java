package com.maisontia.api.service;

import com.maisontia.api.security.InputSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads").toAbsolutePath().normalize();

    private static final long MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"
    );
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"
    );

    public FileStorageService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'initialiser le répertoire de stockage sécurisé", e);
        }
    }

    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier téléversé est vide ou absent");
        }

        // 1. Validation de la taille
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Le fichier dépasse la taille maximale autorisée (50 Mo)");
        }

        // 2. Validation du nom d'origine et de l'extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Nom de fichier manquant");
        }

        String sanitizedName = InputSanitizer.sanitizeFilename(originalFilename);
        String extension = "";
        int dotIndex = sanitizedName.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = sanitizedName.substring(dotIndex).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Extension de fichier non autorisée (" + extension + "). Extensions acceptées : " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        // 3. Validation du Content-Type (MIME Type)
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Type MIME non autorisé (" + contentType + "). Types acceptés : " + String.join(", ", ALLOWED_MIME_TYPES));
        }

        // 4. Génération d'un nom de stockage unique et sécurisé (Path Traversal Safe)
        String uniqueStoredName = UUID.randomUUID().toString() + "_" + sanitizedName;
        Path destinationPath = this.root.resolve(uniqueStoredName).normalize();

        // Vérification absolue contre les attaques Path Traversal (../)
        if (!destinationPath.startsWith(this.root)) {
            throw new SecurityException("Tentative d'accès hors du répertoire de stockage sécurisé");
        }

        try {
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + uniqueStoredName;
        } catch (IOException e) {
            throw new RuntimeException("Échec de la sauvegarde sécurisée du fichier", e);
        }
    }
}

