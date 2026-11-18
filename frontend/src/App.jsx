import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';

function App() {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <>
      <Navbar cantidadCarrito={carrito.length} />
      <div className="container mt-5">
        <h2 className="mb-4">Catálogo de Equipos</h2>
        <ProductCatalog agregarAlCarrito={agregarAlCarrito} />
      </div>
    </>
  );
}

export default App;