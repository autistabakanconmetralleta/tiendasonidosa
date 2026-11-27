package cl.sonidovivo.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        Long usuarioId,
        String usuarioNombre,
        String usuarioEmail,
        LocalDateTime fecha,
        String estado,
        String tipoEntrega,
        String direccion,
        String telefono,
        Integer total,
        List<DetallePedidoResponse> detalles
) {
}