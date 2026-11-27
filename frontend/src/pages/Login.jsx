import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = ({ iniciarSesion, mensaje }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (email.trim() === '' || password === '') {
      setError('Completa el correo y la contraseña.');
      return;
    }
    const mensajeError = await iniciarSesion(email.trim(), password);
    if (mensajeError) {
      setError(mensajeError);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-4">Iniciar sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {mensaje && !error && <div className="alert alert-warning">{mensaje}</div>}
        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
        <p className="mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};