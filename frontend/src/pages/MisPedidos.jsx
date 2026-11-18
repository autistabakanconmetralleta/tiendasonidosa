import { Link } from 'react-router-dom';

export const MisPedidos = ({ pedidos, usuarioActual }) => {
  const misPedidos = pedidos.filter(p => p.clienteId === usuarioActual.id);

  const badgeEstado = (estado) => {
    if (estado === 'En preparación') return 'bg-warning text-dark';
    if (estado === 'Despachado') return 'bg-info text-dark';
    return 'bg-success';
  };

  return (
    <>
      <h2 className="mb-4">Mis Pedidos</h2>
      {misPedidos.length === 0 ? (
        <div className="alert alert-info">
          Aún no has realizado pedidos. <Link to="/">Explora el catálogo</Link>.
        </div>
      ) : (
        <div className="row">
          {misPedidos.map(pedido => (
            <div className="col-md-6 mb-3" key={pedido.id}>
              <div className="card shadow-sm h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>Pedido #{pedido.id}</strong>
                  <span className={`badge ${badgeEstado(pedido.estado)}`}>{pedido.estado}</span>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Fecha:</strong> {pedido.fecha}</p>
                  <p className="mb-1"><strong>Entrega:</strong> {pedido.direccion}</p>
                  <p className="mb-2"><strong>Teléfono:</strong> {pedido.telefono}</p>
                  <ul className="list-group list-group-flush mb-3">
                    {pedido.items.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between px-0">
                        <span>{item.nombre} (x{item.cantidad})</span>
                        <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                      </li>
                    ))}
                  </ul>
                  <h5 className="text-end mb-0">Total: ${pedido.total.toLocaleString('es-CL')}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};