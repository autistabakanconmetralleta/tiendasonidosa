import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RutaProtegida } from './components/RutaProtegida';
import { Catalogo } from './pages/Catalogo';
import { Carrito } from './pages/Carrito';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { MisPedidos } from './pages/MisPedidos';
import { GestionTienda } from './pages/GestionTienda';
import { usuariosIniciales } from './data/usuarios';
import { productos as productosIniciales } from './data/productos';

function App() {
  const [productos, setProductos] = useState(productosIniciales);
  const [carrito, setCarrito] = useState([]);
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  const agregarAlCarrito = (producto) => {
    const productoActual = productos.find(p => p.id === producto.id);
    if (!productoActual || productoActual.stock <= 0) return;

    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      if (existe.cantidad >= productoActual.stock) return;
      setCarrito(carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...productoActual, cantidad: 1 }]);
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

  const confirmarPedido = (datosEntrega) => {
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const nuevoPedido = {
      id: 1000 + pedidos.length + 1,
      clienteId: usuarioActual.id,
      clienteNombre: usuarioActual.nombre,
      fecha: new Date().toLocaleDateString('es-CL'),
      items: carrito,
      total,
      estado: 'En preparación',
      ...datosEntrega
    };

    setProductos(productos.map(prod => {
      const comprado = carrito.find(item => item.id === prod.id);
      return comprado ? { ...prod, stock: Math.max(0, prod.stock - comprado.cantidad) } : prod;
    }));

    setPedidos([nuevoPedido, ...pedidos]);
    setCarrito([]);
  };

  // CRUD Productos
  const agregarProducto = (nuevoProd) => {
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    setProductos([{ id: nuevoId, ...nuevoProd }, ...productos]);
  };

  const actualizarProducto = (prodActualizado) => {
    setProductos(productos.map(p => (p.id === prodActualizado.id ? prodActualizado : p)));
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  // Gestión de estado de pedidos
  const cambiarEstadoPedido = (pedidoId, nuevoEstado) => {
    setPedidos(pedidos.map(p => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p)));
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
          <Route
            path="/"
            element={<Catalogo productos={productos} agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                agregar={agregarAlCarrito}
                restar={restarDelCarrito}
                quitar={quitarDelCarrito}
                usuarioActual={usuarioActual}
                confirmarPedido={confirmarPedido}
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
                <MisPedidos pedidos={pedidos} usuarioActual={usuarioActual} />
              </RutaProtegida>
            }
          />
          <Route
            path="/gestion-tienda"
            element={
              <RutaProtegida usuarioActual={usuarioActual} rolesPermitidos={['Vendedor', 'Administrador']}>
                <GestionTienda
                  productos={productos}
                  agregarProducto={agregarProducto}
                  actualizarProducto={actualizarProducto}
                  eliminarProducto={eliminarProducto}
                  pedidos={pedidos}
                  cambiarEstadoPedido={cambiarEstadoPedido}
                />
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