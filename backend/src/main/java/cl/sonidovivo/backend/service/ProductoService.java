package cl.sonidovivo.backend.service;

import cl.sonidovivo.backend.model.Producto;
import cl.sonidovivo.backend.repository.ProductoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> listar(String categoria) {
        if (categoria == null || categoria.isBlank()) {
            return productoRepository.findAll();
        }
        return productoRepository.findByCategoria(categoria);
    }

    public Producto buscar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    public Producto crear(Producto producto) {
        if (productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con ese código");
        }
        producto.setId(null);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto datos) {
        Producto existente = buscar(id);
        boolean cambioCodigo = !existente.getCodigo().equals(datos.getCodigo());
        if (cambioCodigo && productoRepository.existsByCodigo(datos.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con ese código");
        }
        existente.setCodigo(datos.getCodigo());
        existente.setCategoria(datos.getCategoria());
        existente.setNombre(datos.getNombre());
        existente.setMarca(datos.getMarca());
        existente.setModelo(datos.getModelo());
        existente.setStock(datos.getStock());
        existente.setPrecio(datos.getPrecio());
        existente.setDescripcion(datos.getDescripcion());
        return productoRepository.save(existente);
    }

    public void eliminar(Long id) {
        Producto existente = buscar(id);
        try {
            productoRepository.delete(existente);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar: el producto tiene pedidos asociados");
        }
    }
}