import { ProductCatalog } from '../components/ProductCatalog';

export const Catalogo = ({ productos, agregarAlCarrito }) => {
  return (
    <>
      <h2 className="mb-4">Catálogo de Equipos</h2>
      <ProductCatalog productos={productos} agregarAlCarrito={agregarAlCarrito} />
    </>
  );
};