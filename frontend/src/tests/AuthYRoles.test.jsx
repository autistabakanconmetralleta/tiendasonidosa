import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../pages/Login';
import { RutaProtegida } from '../components/RutaProtegida';

describe('Autenticación y Control de Acceso (RBAC)', () => {
  it('muestra error si se intenta ingresar con campos vacíos o credenciales inválidas', () => {
    const loginMock = vi.fn(() => false);
    render(
      <MemoryRouter>
        <Login iniciarSesion={loginMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
    expect(screen.getByText(/Completa el correo y la contraseña/i)).toBeInTheDocument();

    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'error@sonidovivo.cl' } });
    fireEvent.change(inputs[1], { target: { value: 'claveerronea' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(loginMock).toHaveBeenCalledWith('error@sonidovivo.cl', 'claveerronea');
    expect(screen.getByText(/Correo o contraseña incorrectos/i)).toBeInTheDocument();
  });

  it('bloquea el acceso a rutas de Administrador si el usuario es Cliente', () => {
    const cliente = { id: 3, nombre: 'Cliente', rol: 'Cliente' };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Inicio Público</div>} />
          <Route
            path="/admin"
            element={
              <RutaProtegida usuarioActual={cliente} rolesPermitidos={['Administrador']}>
                <div>Panel Secreto Admin</div>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Panel Secreto Admin')).not.toBeInTheDocument();
    expect(screen.getByText('Inicio Público')).toBeInTheDocument();
  });
});