import { ProductCatalog } from '../components/ProductCatalog';

export const Catalogo = ({ agregarAlCarrito }) => {
  return (
    <>
      <h2 className="mb-4">Catálogo de Equipos</h2>
      <ProductCatalog agregarAlCarrito={agregarAlCarrito} />
    </>
  );
};