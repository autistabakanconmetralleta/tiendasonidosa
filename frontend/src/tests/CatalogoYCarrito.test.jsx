import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProductCatalog } from '../components/ProductCatalog';
import { Carrito } from '../pages/Carrito';

const productosMock = [
  {
    id: 1,
    codigo: 'GA001',
    categoria: 'Guitarras Acústicas',
    nombre: 'Guitarra Acústica Folk',
    marca: 'Yamaha',
    modelo: 'F310',
    stock: 2,
    precio: 129990,
    descripcion: 'Tapa de abeto',
  },
  {
    id: 2,
    codigo: 'PE001',
    categoria: 'Pedales de Efectos',
    nombre: 'Pedal Distorsión',
    marca: 'Boss',
    modelo: 'DS-1',
    stock: 0,
    precio: 79990,
    descripcion: 'Clásico pedal',
  },
];

describe('Catálogo de Productos y Carrito', () => {
  it('filtra productos por texto y deshabilita botón cuando no hay stock', () => {
    const agregarMock = vi.fn();
    render(<ProductCatalog productos={productosMock} agregarAlCarrito={agregarMock} />);

    // Verifica producto sin stock
    expect(screen.getByText(/Sin stock/i)).toBeDisabled();

    // Prueba filtro de búsqueda
    const inputBusqueda = screen.getByPlaceholderText(/Buscar por nombre o marca/i);
    fireEvent.change(inputBusqueda, { target: { value: 'Yamaha' } });

    expect(screen.getByText('Guitarra Acústica Folk')).toBeInTheDocument();
    expect(screen.queryByText('Pedal Distorsión')).not.toBeInTheDocument();

    // Clic en agregar al carrito
    fireEvent.click(screen.getByText(/Agregar al carrito/i));
    expect(agregarMock).toHaveBeenCalledTimes(1);
    expect(agregarMock).toHaveBeenCalledWith(productosMock[0]);
  });

  it('calcula total y permite confirmar pedido cuando hay usuario autenticado', () => {
    const confirmarMock = vi.fn();
    const carritoMock = [{ ...productosMock[0], cantidad: 2 }];
    const usuarioMock = { id: 3, nombre: 'Cliente Prueba', rol: 'Cliente' };

    render(
      <BrowserRouter>
        <Carrito
          carrito={carritoMock}
          agregar={vi.fn()}
          restar={vi.fn()}
          quitar={vi.fn()}
          usuarioActual={usuarioMock}
          confirmarPedido={confirmarMock}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Total: \$259\.980/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/\+56912345678/i), {
      target: { value: '+56987654321' },
    });
    fireEvent.click(screen.getByText(/Confirmar Pedido/i));

    expect(confirmarMock).toHaveBeenCalledWith({
      tipoEntrega: 'retiro',
      direccion: 'Retiro en tienda (Viña del Mar)',
      telefono: '+56987654321',
    });
  });
});