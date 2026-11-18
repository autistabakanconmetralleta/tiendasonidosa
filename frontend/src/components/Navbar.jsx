import { Link } from 'react-router-dom';

export const Navbar = ({ cantidadCarrito, usuarioActual, cerrarSesion }) => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand mb-0 h1">Sonido Vivo</Link>
        <div className="d-flex align-items-center gap-2">
          {usuarioActual ? (
            <>
              <span className="text-light">Hola, {usuarioActual.nombre}</span>
              <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-light btn-sm">Ingresar</Link>
          )}
          <Link to="/carrito" className="btn btn-outline-light">
            Carrito ({cantidadCarrito})
          </Link>
        </div>
      </div>
    </nav>
  );
};