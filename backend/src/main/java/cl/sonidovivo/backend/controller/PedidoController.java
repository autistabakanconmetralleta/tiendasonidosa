package cl.sonidovivo.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.backend.dto.EstadoRequest;
import cl.sonidovivo.backend.dto.PedidoRequest;
import cl.sonidovivo.backend.dto.PedidoResponse;
import cl.sonidovivo.backend.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Compras de los clientes y su seguimiento")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un pedido y descontar el stock (solo clientes)")
    public PedidoResponse crear(@Valid @RequestBody PedidoRequest request, Authentication authentication) {
        return pedidoService.crear(authentication.getName(), request);
    }

    @GetMapping("/mios")
    @Operation(summary = "Ver los pedidos del usuario que inició sesión")
    public List<PedidoResponse> mios(Authentication authentication) {
        return pedidoService.listarMios(authentication.getName());
    }

    @GetMapping
    @Operation(summary = "Ver todos los pedidos (vendedor y administrador)")
    public List<PedidoResponse> todos() {
        return pedidoService.listarTodos();
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de un pedido (vendedor y administrador)")
    public PedidoResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest request) {
        return pedidoService.cambiarEstado(id, request.estado());
    }
}