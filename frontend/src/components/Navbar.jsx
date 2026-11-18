export const Navbar = ({ cantidadCarrito }) => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand mb-0 h1">Sonido Vivo</span>
        <button className="btn btn-outline-light">
          Carrito ({cantidadCarrito})
        </button>
      </div>
    </nav>
  );
};