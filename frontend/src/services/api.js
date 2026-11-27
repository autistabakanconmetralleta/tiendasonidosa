const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const obtenerToken = () => localStorage.getItem('token');

export const guardarSesion = (datos) => {
  localStorage.setItem('token', datos.token);
  localStorage.setItem('usuario', JSON.stringify({
    id: datos.id,
    nombre: datos.nombre,
    email: datos.email,
    rol: datos.rol
  }));
};

export const borrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

const tokenVigente = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const cuerpo = JSON.parse(atob(base64));
    return cuerpo.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

export const leerSesion = () => {
  const token = obtenerToken();
  const guardado = localStorage.getItem('usuario');
  if (!token || !guardado || !tokenVigente(token)) {
    borrarSesion();
    return null;
  }
  try {
    return JSON.parse(guardado);
  } catch (e) {
    borrarSesion();
    return null;
  }
};

const peticion = async (ruta, opciones = {}) => {
  const cabeceras = { 'Content-Type': 'application/json' };
  const token = obtenerToken();
  if (token) {
    cabeceras.Authorization = 'Bearer ' + token;
  }

  let respuesta;
  try {
    respuesta = await fetch(URL_BASE + ruta, { ...opciones, headers: cabeceras });
  } catch (e) {
    throw new Error('No se pudo conectar con el servidor');
  }

  if (respuesta.status === 204) {
    return null;
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch (e) {
    datos = null;
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401 && token && !ruta.startsWith('/api/auth')) {
      borrarSesion();
      window.dispatchEvent(new Event('sesion-expirada'));
    }
    const error = new Error(datos && datos.message ? datos.message : 'Error ' + respuesta.status);
    error.estado = respuesta.status;
    throw error;
  }

  return datos;
};

const enviar = (metodo, cuerpo) => ({
  method: metodo,
  body: JSON.stringify(cuerpo)
});

export const loginApi = (email, password) =>
  peticion('/api/auth/login', enviar('POST', { email, password }));

export const registroApi = (nombre, email, password) =>
  peticion('/api/auth/registro', enviar('POST', { nombre, email, password }));

export const listarProductosApi = () => peticion('/api/productos');

export const crearProductoApi = (producto) =>
  peticion('/api/productos', enviar('POST', producto));

export const actualizarProductoApi = (id, producto) =>
  peticion('/api/productos/' + id, enviar('PUT', producto));

export const eliminarProductoApi = (id) =>
  peticion('/api/productos/' + id, { method: 'DELETE' });

export const actualizarStockApi = (id, stock) =>
  peticion('/api/productos/' + id + '/stock', enviar('PATCH', { stock }));

export const crearPedidoApi = (pedido) =>
  peticion('/api/pedidos', enviar('POST', pedido));

export const listarMisPedidosApi = () => peticion('/api/pedidos/mios');

export const listarPedidosApi = () => peticion('/api/pedidos');

export const cambiarEstadoApi = (id, estado) =>
  peticion('/api/pedidos/' + id + '/estado', enviar('PATCH', { estado }));

export const listarUsuariosApi = () => peticion('/api/usuarios');

export const crearUsuarioApi = (usuario) =>
  peticion('/api/usuarios', enviar('POST', usuario));

export const actualizarUsuarioApi = (id, usuario) =>
  peticion('/api/usuarios/' + id, enviar('PUT', usuario));

export const desactivarUsuarioApi = (id) =>
  peticion('/api/usuarios/' + id, { method: 'DELETE' });