package com.maisontia.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CustomerRequestDto {

    @NotBlank(message = "Le nom du client est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit comporter entre 2 et 100 caractères")
    private String customerName;

    @NotBlank(message = "L'adresse email est obligatoire")
    @Email(message = "Le format de l'adresse email est invalide")
    @Size(max = 150, message = "L'adresse email ne doit pas dépasser 150 caractères")
    private String email;

    @Size(max = 30, message = "Le numéro de téléphone est trop long")
    @Pattern(regexp = "^$|^[+0-9\\s().-]{6,30}$", message = "Format de numéro de téléphone invalide")
    private String phone;

    @Size(max = 3000, message = "Le message ne peut pas dépasser 3000 caractères")
    private String message;

    @Size(max = 100, message = "Le service demandé est trop long")
    private String requestedService;

    public CustomerRequestDto() {}

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRequestedService() {
        return requestedService;
    }

    public void setRequestedService(String requestedService) {
        this.requestedService = requestedService;
    }
}
