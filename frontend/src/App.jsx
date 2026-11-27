import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RutaProtegida } from './components/RutaProtegida';
import { Catalogo } from './pages/Catalogo';
import { Carrito } from './pages/Carrito';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { MisPedidos } from './pages/MisPedidos';
import { GestionTienda } from './pages/GestionTienda';
import { AdminUsuarios } from './pages/AdminUsuarios';
import { Ubicacion } from './pages/Ubicacion';
import {
  listarProductosApi,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi,
  actualizarStockApi,
  crearPedidoApi,
  listarMisPedidosApi,
  listarPedidosApi,
  cambiarEstadoApi,
  listarUsuariosApi,
  crearUsuarioApi,
  actualizarUsuarioApi,
  loginApi,
  registroApi,
  guardarSesion,
  borrarSesion,
  leerSesion
} from './services/api';

const textoError = (error) => {
  if (error.estado === 401) return 'Tu sesión expiró. Inicia sesión de nuevo.';
  if (error.estado === 403) return 'No tienes permiso para esta acción.';
  if (error.estado === 400) return 'Revisa los datos ingresados.';
  return error.message;
};

const aFecha = (valor) => {
  const fecha = Array.isArray(valor) ? new Date(valor[0], valor[1] - 1, valor[2]) : new Date(valor);
  return fecha.toLocaleDateString('es-CL');
};

const aPedidoFront = (p) => ({
  id: p.id,
  clienteId: p.usuarioId,
  clienteNombre: p.usuarioNombre,
  fecha: aFecha(p.fecha),
  items: p.detalles.map(d => ({
    id: d.productoId,
    nombre: d.nombre,
    cantidad: d.cantidad,
    precio: d.precioUnitario
  })),
  total: p.total,
  estado: p.estado,
  tipoEntrega: p.tipoEntrega,
  direccion: p.direccion,
  telefono: p.telefono
});

function App() {
  const [productos, setProductos] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(leerSesion);
  const [mensajeSesion, setMensajeSesion] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listarProductosApi()
      .then(datos => setProductos(datos))
      .catch(error => setErrorGeneral(error.message));
  }, []);

  useEffect(() => {
    const alExpirar = () => {
      setUsuarioActual(null);
      setMensajeSesion('Tu sesión expiró. Inicia sesión de nuevo.');
      navigate('/login');
    };
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, [navigate]);

  useEffect(() => {
    if (!usuarioActual) {
      setPedidos([]);
      setUsuarios([]);
      return;
    }

    const cargarDatos = async () => {
      try {
        const lista = usuarioActual.rol === 'Cliente'
          ? await listarMisPedidosApi()
          : await listarPedidosApi();
        setPedidos(lista.map(aPedidoFront));

        if (usuarioActual.rol === 'Administrador') {
          setUsuarios(await listarUsuariosApi());
        }
      } catch (error) {
        if (error.estado !== 401) setErrorGeneral(textoError(error));
      }
    };

    cargarDatos();
  }, [usuarioActual]);

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

  const confirmarPedido = async (datosEntrega) => {
    try {
      const respuesta = await crearPedidoApi({
        tipoEntrega: datosEntrega.tipoEntrega,
        direccion: datosEntrega.direccion,
        telefono: datosEntrega.telefono,
        items: carrito.map(item => ({ productoId: item.id, cantidad: item.cantidad }))
      });
      setPedidos([aPedidoFront(respuesta), ...pedidos]);
      setCarrito([]);
      setProductos(await listarProductosApi());
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const agregarProducto = async (datos) => {
    try {
      const creado = await crearProductoApi(datos);
      setProductos([creado, ...productos]);
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const actualizarProducto = async (producto) => {
    try {
      const { id, ...datos } = producto;
      const actualizado = await actualizarProductoApi(id, datos);
      setProductos(productos.map(p => (p.id === id ? actualizado : p)));
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await eliminarProductoApi(id);
      setProductos(productos.filter(p => p.id !== id));
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const actualizarStock = async (id, stock) => {
    try {
      const actualizado = await actualizarStockApi(id, stock);
      setProductos(productos.map(p => (p.id === id ? actualizado : p)));
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const actualizado = await cambiarEstadoApi(pedidoId, nuevoEstado);
      setPedidos(pedidos.map(p => (p.id === pedidoId ? aPedidoFront(actualizado) : p)));
    } catch (error) {
      setErrorGeneral(textoError(error));
    }
  };

  const crearUsuarioAdmin = async (datos) => {
    try {
      const creado = await crearUsuarioApi(datos);
      setUsuarios([...usuarios, creado]);
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const actualizarUsuarioAdmin = async (datos) => {
    try {
      const { id, ...resto } = datos;
      const actual = usuarios.find(u => u.id === id);
      const actualizado = await actualizarUsuarioApi(id, { ...resto, activo: actual.activo });
      setUsuarios(usuarios.map(u => (u.id === id ? actualizado : u)));
      return '';
    } catch (error) {
      return textoError(error);
    }
  };

  const toggleActivoUsuario = async (id) => {
    try {
      const actual = usuarios.find(u => u.id === id);
      const actualizado = await actualizarUsuarioApi(id, {
        nombre: actual.nombre,
        email: actual.email,
        rol: actual.rol,
        activo: !actual.activo
      });
      setUsuarios(usuarios.map(u => (u.id === id ? actualizado : u)));
    } catch (error) {
      setErrorGeneral(textoError(error));
    }
  };

  const iniciarSesion = async (email, password) => {
    try {
      const datos = await loginApi(email, password);
      guardarSesion(datos);
      setUsuarioActual({ id: datos.id, nombre: datos.nombre, email: datos.email, rol: datos.rol });
      setMensajeSesion('');
      setErrorGeneral('');
      return '';
    } catch (error) {
      if (error.estado === 401) return 'Correo o contraseña incorrectos.';
      if (error.estado === 403) return 'Tu usuario está desactivado.';
      return error.message;
    }
  };

  const cerrarSesion = () => {
    borrarSesion();
    setUsuarioActual(null);
    setCarrito([]);
    setErrorGeneral('');
  };

  const registrarUsuario = async (datos) => {
    try {
      const respuesta = await registroApi(datos.nombre, datos.email, datos.password);
      guardarSesion(respuesta);
      setUsuarioActual({ id: respuesta.id, nombre: respuesta.nombre, email: respuesta.email, rol: respuesta.rol });
      setErrorGeneral('');
      return '';
    } catch (error) {
      return error.message;
    }
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
        {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}
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
          <Route path="/login" element={<Login iniciarSesion={iniciarSesion} mensaje={mensajeSesion} />} />
          <Route path="/registro" element={<Registro registrarUsuario={registrarUsuario} />} />

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
                  usuarioActual={usuarioActual}
                  agregarProducto={agregarProducto}
                  actualizarProducto={actualizarProducto}
                  eliminarProducto={eliminarProducto}
                  actualizarStock={actualizarStock}
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
                <AdminUsuarios
                  usuarios={usuarios}
                  usuarioActual={usuarioActual}
                  crearUsuarioAdmin={crearUsuarioAdmin}
                  actualizarUsuarioAdmin={actualizarUsuarioAdmin}
                  toggleActivoUsuario={toggleActivoUsuario}
                />
              </RutaProtegida>
            }
          />
          <Route path="/ubicacion" element={<Ubicacion />} />
        </Routes>
      </div>
    </>
  );
}

export default App;