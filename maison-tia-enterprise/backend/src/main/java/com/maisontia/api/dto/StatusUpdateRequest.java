package com.maisontia.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateRequest {

    @NotBlank(message = "Le statut est obligatoire")
    @Pattern(regexp = "^(?i)(EN_ATTENTE|CONFIRME|PLANIFIE|TRAITE|ANNULE)$", message = "Statut invalide. Valeurs autorisées : EN_ATTENTE, CONFIRME, PLANIFIE, TRAITE, ANNULE")
    private String status;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
