import { useState } from 'react';
import { ProductCard } from './ProductCard';

const productosIniciales = [
  { id: 1, nombre: 'Hotone Ampero Mini', descripcion: 'Pedalera multiefectos compacta con modelado de amplificadores.', precio: 215000 },
  { id: 2, nombre: 'Audífonos Sony WH-700N', descripcion: 'Audífonos inalámbricos over-ear ideales para edición y monitoreo.', precio: 85000 },
  { id: 3, nombre: 'Ukelele Soprano Tradicional', descripcion: 'Cuerpo de caoba, excelente resonancia para fingerpicking y acordes.', precio: 42000 }
];

export const ProductCatalog = ({ agregarAlCarrito }) => {
  const [productos, setProductos] = useState(productosIniciales);

  return (
    <div className="row">
      {productos.map(producto => (
        <ProductCard 
          key={producto.id} 
          producto={producto} 
          agregarAlCarrito={agregarAlCarrito} 
        />
      ))}
    </div>
  );
};