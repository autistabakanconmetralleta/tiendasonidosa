import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Catalogo } from './pages/Catalogo';
import { Carrito } from './pages/Carrito';

function App() {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      if (existe.cantidad >= producto.stock) return;
      setCarrito(carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const restarDelCarrito = (id) => {
    setCarrito(
      carrito
        .map(item => item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item)
        .filter(item => item.cantidad > 0)
    );
  };

  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const totalProductos = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <>
      <Navbar cantidadCarrito={totalProductos} />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Catalogo agregarAlCarrito={agregarAlCarrito} />} />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                agregar={agregarAlCarrito}
                restar={restarDelCarrito}
                quitar={quitarDelCarrito}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;