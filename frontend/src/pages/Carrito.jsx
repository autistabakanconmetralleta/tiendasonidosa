import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Carrito = ({ carrito, agregar, restar, quitar, usuarioActual, confirmarPedido }) => {
  const [tipoEntrega, setTipoEntrega] = useState('retiro');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  if (carrito.length === 0) {
    return (
      <>
        <h2>Tu carrito</h2>
        <p className="text-muted">El carrito está vacío.</p>
        <Link to="/" className="btn btn-primary">Ir al catálogo</Link>
      </>
    );
  }

  const manejarCompra = async (e) => {
    e.preventDefault();
    if (!usuarioActual) {
      navigate('/login');
      return;
    }
    if (usuarioActual.rol !== 'Cliente') {
      setError('Solo los clientes pueden realizar pedidos.');
      return;
    }
    if (telefono.trim().length < 8) {
      setError('Ingresa un teléfono de contacto válido (mínimo 8 dígitos).');
      return;
    }
    if (tipoEntrega === 'despacho' && direccion.trim().length < 5) {
      setError('Ingresa una dirección completa para el despacho.');
      return;
    }

    setError('');
    const mensajeError = await confirmarPedido({
      tipoEntrega,
      direccion: tipoEntrega === 'despacho' ? direccion.trim() : 'Retiro en tienda (Viña del Mar)',
      telefono: telefono.trim()
    });

    if (mensajeError) {
      setError(mensajeError);
    } else {
      navigate('/mis-pedidos');
    }
  };

  return (
    <>
      <h2 className="mb-4">Tu carrito</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map(item => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString('es-CL')}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => restar(item.id)}>-</button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => agregar(item)}
                    disabled={item.cantidad >= item.stock}
                  >
                    +
                  </button>
                </td>
                <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => quitar(item.id)}>Quitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row justify-content-end mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-3">Total: ${total.toLocaleString('es-CL')}</h4>
              {error && <div className="alert alert-danger">{error}</div>}

              {!usuarioActual ? (
                <div className="alert alert-warning mb-0">
                  Debes <Link to="/login">iniciar sesión</Link> para confirmar tu pedido.
                </div>
              ) : (
                <form onSubmit={manejarCompra}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Modalidad de entrega</label>
                    <select
                      className="form-select"
                      value={tipoEntrega}
                      onChange={(e) => setTipoEntrega(e.target.value)}
                    >
                      <option value="retiro">Retiro en Tienda (Viña del Mar - Gratis)</option>
                      <option value="despacho">Despacho a Domicilio (Starken / Chilexpress)</option>
                    </select>
                  </div>

                  {tipoEntrega === 'despacho' && (
                    <div className="mb-3">
                      <label className="form-label">Dirección de envío</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Av. Libertad 1234, Viña del Mar"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Teléfono de contacto</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Ej: +56912345678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-success w-100 fw-bold">
                    Confirmar Pedido
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};