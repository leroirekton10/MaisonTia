package com.maisontia.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "L'identifiant est obligatoire")
    @Size(min = 2, max = 100, message = "L'identifiant doit contenir entre 2 et 100 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-@]+$", message = "L'identifiant contient des caractères non autorisés")
    private String username;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 4, max = 128, message = "Le mot de passe doit contenir entre 4 et 128 caractères")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
