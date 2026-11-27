package cl.sonidovivo.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record PedidoRequest(
        @NotBlank String tipoEntrega,
        String direccion,
        @NotEmpty @Valid List<ItemPedidoRequest> items
) {
}