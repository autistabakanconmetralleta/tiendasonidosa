package cl.sonidovivo.backend.dto;

public record AuthResponse(
        String token,
        Long id,
        String nombre,
        String email,
        String rol
) {
}