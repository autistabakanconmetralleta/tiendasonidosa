import { Link } from 'react-router-dom';

export const Navbar = ({ cantidadCarrito, usuarioActual, cerrarSesion }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand mb-0 h1">
          Sonido Vivo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link to="/ubicacion" className="nav-link">Tienda y Retiro</Link>
            </li>

            {usuarioActual?.rol === 'Cliente' && (
              <li className="nav-item">
                <Link to="/mis-pedidos" className="nav-link">Mis Pedidos</Link>
              </li>
            )}

            {(usuarioActual?.rol === 'Vendedor' || usuarioActual?.rol === 'Administrador') && (
              <li className="nav-item">
                <Link to="/gestion-tienda" className="nav-link">Gestión Productos y Pedidos</Link>
              </li>
            )}

            {usuarioActual?.rol === 'Administrador' && (
              <li className="nav-item">
                <Link to="/admin-usuarios" className="nav-link">Administrar Usuarios</Link>
              </li>
            )}
          </ul>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-lg-0">
            {usuarioActual ? (
              <>
                <span className="text-light small">
                  Hola, <strong>{usuarioActual.nombre}</strong> ({usuarioActual.rol})
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline-light btn-sm">
                Ingresar
              </Link>
            )}

            <Link to="/carrito" className="btn btn-warning btn-sm fw-bold">
              Carrito ({cantidadCarrito})
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};