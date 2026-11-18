import { Link } from 'react-router-dom';

export const Carrito = ({ carrito, agregar, restar, quitar }) => {
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
      <h4 className="text-end">Total: ${total.toLocaleString('es-CL')}</h4>
    </>
  );
};