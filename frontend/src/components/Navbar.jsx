import { Link } from 'react-router-dom';

export const Navbar = ({ cantidadCarrito }) => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand mb-0 h1">Sonido Vivo</Link>
        <Link to="/carrito" className="btn btn-outline-light">
          Carrito ({cantidadCarrito})
        </Link>
      </div>
    </nav>
  );
};