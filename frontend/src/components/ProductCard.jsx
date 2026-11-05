export const ProductCard = ({ producto, agregarAlCarrito }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="card-text text-muted">{producto.descripcion}</p>
          <h4 className="mt-auto fw-bold">${producto.precio.toLocaleString('es-CL')}</h4>
          <button 
            onClick={() => agregarAlCarrito(producto)} 
            className="btn btn-primary mt-3 w-100"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};