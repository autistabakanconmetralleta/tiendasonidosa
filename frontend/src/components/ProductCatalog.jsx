import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { productos as productosIniciales} from '../data/productos';


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