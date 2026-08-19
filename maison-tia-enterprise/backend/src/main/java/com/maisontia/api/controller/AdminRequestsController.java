package com.maisontia.api.controller;

import com.maisontia.api.domain.CustomerRequest;
import com.maisontia.api.dto.CustomerRequestDto;
import com.maisontia.api.dto.StatusUpdateRequest;
import com.maisontia.api.repository.CustomerRequestRepository;
import com.maisontia.api.security.InputSanitizer;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/requests")
@CrossOrigin(origins = {"https://www.maisontia.com", "http://localhost:5173"})
public class AdminRequestsController {
    private final CustomerRequestRepository repository;

    public AdminRequestsController(CustomerRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<CustomerRequest>> getAllRequests() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitPublicRequest(@Valid @RequestBody CustomerRequestDto dto) {
        CustomerRequest request = new CustomerRequest();
        request.setCustomerName(InputSanitizer.sanitize(dto.getCustomerName()));
        request.setEmail(InputSanitizer.sanitize(dto.getEmail()));
        request.setMessage(InputSanitizer.sanitize(dto.getMessage()));
        request.setRequestedService(InputSanitizer.sanitize(dto.getRequestedService()));
        request.setCreatedAt(LocalDateTime.now());
        request.setProcessed(false);

        CustomerRequest saved = repository.save(request);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Votre demande de consultation privée a été enregistrée avec succès.",
                "id", saved.getId()
        ));
    }

    @PatchMapping("/{id}/process")
    public ResponseEntity<?> markAsProcessed(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", "ID de demande invalide"));
        }
        CustomerRequest req = repository.findById(id).orElse(null);
        if (req == null) {
            return ResponseEntity.notFound().build();
        }
        req.setProcessed(true);
        repository.save(req);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Demande marquée comme traitée"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest statusUpdate) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", "ID de demande invalide"));
        }
        CustomerRequest req = repository.findById(id).orElse(null);
        if (req == null) {
            return ResponseEntity.notFound().build();
        }
        // Save processed state accordingly
        String sanitizedStatus = InputSanitizer.sanitize(statusUpdate.getStatus()).toUpperCase();
        req.setProcessed("CONFIRME".equals(sanitizedStatus) || "TRAITE".equals(sanitizedStatus));
        repository.save(req);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "currentStatus", sanitizedStatus));
    }
}

