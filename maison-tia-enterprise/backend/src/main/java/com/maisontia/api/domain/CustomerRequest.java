package com.maisontia.api.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_requests")
public class CustomerRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String email;
    private String message;
    private String requestedService; // "consultation", "order"
    private LocalDateTime createdAt;
    private boolean processed = false;

    public CustomerRequest() {}

    public CustomerRequest(Long id, String customerName, String email, String message, String requestedService, LocalDateTime createdAt, boolean processed) {
        this.id = id;
        this.customerName = customerName;
        this.email = email;
        this.message = message;
        this.requestedService = requestedService;
        this.createdAt = createdAt;
        this.processed = processed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRequestedService() { return requestedService; }
    public void setRequestedService(String requestedService) { this.requestedService = requestedService; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isProcessed() { return processed; }
    public void setProcessed(boolean processed) { this.processed = processed; }
}
