import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { categorias } from '../data/productos';

export const ProductCatalog = ({ productos, agregarAlCarrito }) => {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const productosFiltrados = productos.filter(producto => {
    const coincideNombre =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o marca..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {productosFiltrados.map(producto => (
          <ProductCard
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
        {productosFiltrados.length === 0 && (
          <p className="text-muted">No se encontraron productos.</p>
        )}
      </div>
    </>
  );
};