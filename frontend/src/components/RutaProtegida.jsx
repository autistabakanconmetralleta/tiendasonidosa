import { Navigate } from 'react-router-dom';

export const RutaProtegida = ({ usuarioActual, rolesPermitidos, children }) => {
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuarioActual.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};