package cl.sonidovivo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
        @NotBlank @Size(min = 3) String nombre,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password
) {
}