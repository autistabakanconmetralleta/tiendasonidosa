package cl.sonidovivo.backend.dto;

import cl.sonidovivo.backend.model.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank @Size(min = 3) String nombre,
        @NotBlank @Email String email,
        String password,
        @NotNull Rol rol,
        Boolean activo
) {
}