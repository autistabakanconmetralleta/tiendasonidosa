package cl.sonidovivo.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record EstadoRequest(
        @NotBlank String estado
) {
}