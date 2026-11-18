import { useState } from 'react';
import { categorias } from '../data/productos';

export const GestionTienda = ({
  productos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  pedidos,
  cambiarEstadoPedido
}) => {
  const [tabActiva, setTabActiva] = useState('productos');
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState({
    codigo: '',
    categoria: categorias[0],
    nombre: '',
    marca: '',
    modelo: '',
    stock: 1,
    precio: 10000,
    descripcion: ''
  });

  const limpiarFormulario = () => {
    setEditandoId(null);
    setError('');
    setFormulario({
      codigo: '',
      categoria: categorias[0],
      nombre: '',
      marca: '',
      modelo: '',
      stock: 1,
      precio: 10000,
      descripcion: ''
    });
  };

  const cargarParaEditar = (producto) => {
    setEditandoId(producto.id);
    setError('');
    setFormulario({
      codigo: producto.codigo,
      categoria: producto.categoria,
      nombre: producto.nombre,
      marca: producto.marca,
      modelo: producto.modelo,
      stock: producto.stock,
      precio: producto.precio,
      descripcion: producto.descripcion
    });
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: name === 'stock' || name === 'precio' ? Number(value) : value
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!formulario.codigo.trim() || !formulario.nombre.trim() || !formulario.marca.trim()) {
      setError('Código, nombre y marca son obligatorios.');
      return;
    }
    if (formulario.precio <= 0 || formulario.stock < 0) {
      setError('El precio debe ser mayor a 0 y el stock no puede ser negativo.');
      return;
    }

    if (editandoId) {
      actualizarProducto({ id: editandoId, ...formulario });
    } else {
      agregarProducto(formulario);
    }
    limpiarFormulario();
  };

  return (
    <>
      <h2 className="mb-4">Gestión de Tienda (Inventario y Pedidos)</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tabActiva === 'productos' ? 'active fw-bold' : ''}`}
            onClick={() => setTabActiva('productos')}
          >
            Inventario de Productos ({productos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabActiva === 'pedidos' ? 'active fw-bold' : ''}`}
            onClick={() => setTabActiva('pedidos')}
          >
            Pedidos Recibidos ({pedidos.length})
          </button>
        </li>
      </ul>

      {tabActiva === 'productos' && (
        <div className="row">
          {/* Formulario Crear / Editar */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                {editandoId ? 'Editar Producto' : 'Nuevo Producto'}
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={manejarEnvio}>
                  <div className="mb-2">
                    <label className="form-label">Código</label>
                    <input
                      type="text"
                      name="codigo"
                      className="form-control form-control-sm"
                      placeholder="Ej: GA010"
                      value={formulario.codigo}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Categoría</label>
                    <select
                      name="categoria"
                      className="form-select form-select-sm"
                      value={formulario.categoria}
                      onChange={manejarCambio}
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control form-control-sm"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <label className="form-label">Marca</label>
                      <input
                        type="text"
                        name="marca"
                        className="form-control form-control-sm"
                        value={formulario.marca}
                        onChange={manejarCambio}
                      />
                    </div>
                    <div className="col-6 mb-2">
                      <label className="form-label">Modelo</label>
                      <input
                        type="text"
                        name="modelo"
                        className="form-control form-control-sm"
                        value={formulario.modelo}
                        onChange={manejarCambio}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        className="form-control form-control-sm"
                        value={formulario.stock}
                        onChange={manejarCambio}
                      />
                    </div>
                    <div className="col-6 mb-2">
                      <label className="form-label">Precio ($)</label>
                      <input
                        type="number"
                        name="precio"
                        min="1"
                        className="form-control form-control-sm"
                        value={formulario.precio}
                        onChange={manejarCambio}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      name="descripcion"
                      rows="2"
                      className="form-control form-control-sm"
                      value={formulario.descripcion}
                      onChange={manejarCambio}
                    ></textarea>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary btn-sm w-100">
                      {editandoId ? 'Guardar Cambios' : 'Agregar Producto'}
                    </button>
                    {editandoId && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={limpiarFormulario}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(prod => (
                    <tr key={prod.id}>
                      <td><code>{prod.codigo}</code></td>
                      <td>
                        <strong>{prod.nombre}</strong>
                        <br />
                        <small className="text-muted">{prod.marca} - {prod.modelo}</small>
                      </td>
                      <td>
                        <span className={`badge ${prod.stock <= 3 ? 'bg-danger' : 'bg-success'}`}>
                          {prod.stock} un.
                        </span>
                      </td>
                      <td>${prod.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => cargarParaEditar(prod)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarProducto(prod.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tabActiva === 'pedidos' && (
        <>
          {pedidos.length === 0 ? (
            <div className="alert alert-info">No hay pedidos registrados aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Entrega</th>
                    <th>Detalle</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(pedido => (
                    <tr key={pedido.id}>
                      <td><strong>#{pedido.id}</strong></td>
                      <td>
                        {pedido.clienteNombre}
                        <br />
                        <small className="text-muted">{pedido.telefono}</small>
                      </td>
                      <td>{pedido.direccion}</td>
                      <td>
                        <ul className="mb-0 ps-3 small">
                          {pedido.items.map(i => (
                            <li key={i.id}>{i.nombre} (x{i.cantidad})</li>
                          ))}
                        </ul>
                      </td>
                      <td><strong>${pedido.total.toLocaleString('es-CL')}</strong></td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={pedido.estado}
                          onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                        >
                          <option value="En preparación">En preparación</option>
                          <option value="Despachado">Despachado</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
};