export const ProductCard = ({ producto, agregarAlCarrito }) => {
  const pocoStock = producto.stock <= 3;

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <small className="text-muted">{producto.categoria}</small>
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="mb-1">
            <strong>{producto.marca}</strong> - {producto.modelo}
          </p>
          <p className="card-text text-muted">{producto.descripcion}</p>
          <p className={pocoStock ? 'text-danger fw-bold' : 'text-success'}>
            {pocoStock
              ? 'Quedan pocas unidades: ' + producto.stock
              : 'Stock disponible: ' + producto.stock}
          </p>
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