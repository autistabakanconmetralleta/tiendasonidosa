import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RutaProtegida } from './components/RutaProtegida';
import { Catalogo } from './pages/Catalogo';
import { Carrito } from './pages/Carrito';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { usuariosIniciales } from './data/usuarios';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [usuarioActual, setUsuarioActual] = useState(null);

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

  const iniciarSesion = (email, password) => {
    const usuario = usuarios.find(u => u.email === email && u.password === password && u.activo);
    if (!usuario) return false;
    setUsuarioActual(usuario);
    return true;
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
  };

  const registrarUsuario = (datos) => {
    const nuevo = { id: usuarios.length + 1, ...datos, rol: 'Cliente', activo: true };
    setUsuarios([...usuarios, nuevo]);
    setUsuarioActual(nuevo);
  };

  const totalProductos = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <>
      <Navbar
        cantidadCarrito={totalProductos}
        usuarioActual={usuarioActual}
        cerrarSesion={cerrarSesion}
      />
      <div className="container mt-4 mb-5">
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
          <Route path="/login" element={<Login iniciarSesion={iniciarSesion} />} />
          <Route
            path="/registro"
            element={<Registro usuarios={usuarios} registrarUsuario={registrarUsuario} />}
          />

          <Route
            path="/mis-pedidos"
            element={
              <RutaProtegida usuarioActual={usuarioActual} rolesPermitidos={['Cliente']}>
                <h2>Mis Pedidos (En construcción - Paso 2)</h2>
              </RutaProtegida>
            }
          />
          <Route
            path="/gestion-tienda"
            element={
              <RutaProtegida usuarioActual={usuarioActual} rolesPermitidos={['Vendedor', 'Administrador']}>
                <h2>Gestión de Inventario y Pedidos (En construcción - Paso 3)</h2>
              </RutaProtegida>
            }
          />
          <Route
            path="/admin-usuarios"
            element={
              <RutaProtegida usuarioActual={usuarioActual} rolesPermitidos={['Administrador']}>
                <h2>Administración de Usuarios (En construcción - Paso 4)</h2>
              </RutaProtegida>
            }
          />
          <Route path="/ubicacion" element={<h2>Ubicación y Retiro (En construcción - Paso 5)</h2>} />
        </Routes>
      </div>
    </>
  );
}

export default App;