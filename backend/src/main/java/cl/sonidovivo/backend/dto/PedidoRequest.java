package cl.sonidovivo.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record PedidoRequest(
        @NotBlank String tipoEntrega,
        String direccion,
        @NotBlank @Size(min = 8, max = 30) String telefono,
        @NotEmpty @Valid List<ItemPedidoRequest> items
) {
}