package cl.sonidovivo.backend.dto;

public record DetallePedidoResponse(
        Long productoId,
        String nombre,
        Integer cantidad,
        Integer precioUnitario,
        Integer subtotal
) {
}