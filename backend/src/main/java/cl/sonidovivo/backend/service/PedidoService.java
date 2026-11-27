package cl.sonidovivo.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.sonidovivo.backend.dto.DetallePedidoResponse;
import cl.sonidovivo.backend.dto.ItemPedidoRequest;
import cl.sonidovivo.backend.dto.PedidoRequest;
import cl.sonidovivo.backend.dto.PedidoResponse;
import cl.sonidovivo.backend.model.DetallePedido;
import cl.sonidovivo.backend.model.Pedido;
import cl.sonidovivo.backend.model.Producto;
import cl.sonidovivo.backend.model.Usuario;
import cl.sonidovivo.backend.repository.PedidoRepository;
import cl.sonidovivo.backend.repository.ProductoRepository;
import cl.sonidovivo.backend.repository.UsuarioRepository;

@Service
public class PedidoService {

    private static final List<String> ESTADOS = List.of("En preparación", "Despachado", "Entregado");

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ProductoRepository productoRepository,
                         UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PedidoResponse crear(String email, PedidoRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        String tipo = request.tipoEntrega().trim().toLowerCase();
        if (!tipo.equals("retiro") && !tipo.equals("despacho")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo de entrega debe ser retiro o despacho");
        }

        String direccion = request.direccion() == null ? "" : request.direccion().trim();
        if (tipo.equals("despacho")) {
            if (direccion.length() < 5) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La dirección de despacho es obligatoria");
            }
        } else {
            direccion = "Retiro en tienda (Viña del Mar)";
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("En preparación");
        pedido.setTipoEntrega(tipo);
        pedido.setDireccion(direccion);
        pedido.setTelefono(request.telefono().trim());

        int total = 0;
        for (ItemPedidoRequest item : request.items()) {
            Producto producto = productoRepository.findById(item.productoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado: " + item.productoId()));

            if (producto.getStock() < item.cantidad()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente para " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - item.cantidad());
            productoRepository.save(producto);

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            pedido.getDetalles().add(detalle);

            total += producto.getPrecio() * item.cantidad();
        }

        pedido.setTotal(total);
        pedidoRepository.save(pedido);
        return aRespuesta(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarMios(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        return pedidoRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId())
                .stream()
                .map(this::aRespuesta)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaDesc()
                .stream()
                .map(this::aRespuesta)
                .toList();
    }

    @Transactional
    public PedidoResponse cambiarEstado(Long id, String estado) {
        if (!ESTADOS.contains(estado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado no válido");
        }
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
        pedido.setEstado(estado);
        pedidoRepository.save(pedido);
        return aRespuesta(pedido);
    }

    private PedidoResponse aRespuesta(Pedido pedido) {
        List<DetallePedidoResponse> detalles = pedido.getDetalles().stream()
                .map(d -> new DetallePedidoResponse(
                        d.getProducto().getId(),
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario(),
                        d.getCantidad() * d.getPrecioUnitario()))
                .toList();

        return new PedidoResponse(
                pedido.getId(),
                pedido.getUsuario().getId(),
                pedido.getUsuario().getNombre(),
                pedido.getUsuario().getEmail(),
                pedido.getFecha(),
                pedido.getEstado(),
                pedido.getTipoEntrega(),
                pedido.getDireccion(),
                pedido.getTelefono(),
                pedido.getTotal(),
                detalles);
    }
}