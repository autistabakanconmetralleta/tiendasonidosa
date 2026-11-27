package cl.sonidovivo.backend.dto;

public record UsuarioResponse(
        Long id,
        String nombre,
        String email,
        String rol,
        boolean activo
) {
}