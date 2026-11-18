import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Registro = ({ usuarios, registrarUsuario }) => {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: ''
  });
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (datos.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 letras.';
    }
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) {
      nuevosErrores.email = 'Ingresa un correo válido.';
    } else if (usuarios.some(u => u.email === datos.email.trim())) {
      nuevosErrores.email = 'Ese correo ya está registrado.';
    }
    if (datos.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (datos.confirmar !== datos.password) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden.';
    }
    return nuevosErrores;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      registrarUsuario({
        nombre: datos.nombre.trim(),
        email: datos.email.trim(),
        password: datos.password
      });
      navigate('/');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h2 className="mb-4">Crear cuenta</h2>
        <form onSubmit={manejarEnvio} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className={'form-control ' + (errores.nombre ? 'is-invalid' : '')}
              value={datos.nombre}
              onChange={cambiar}
            />
            <div className="invalid-feedback">{errores.nombre}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="email"
              className={'form-control ' + (errores.email ? 'is-invalid' : '')}
              value={datos.email}
              onChange={cambiar}
            />
            <div className="invalid-feedback">{errores.email}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className={'form-control ' + (errores.password ? 'is-invalid' : '')}
              value={datos.password}
              onChange={cambiar}
            />
            <div className="invalid-feedback">{errores.password}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Repetir contraseña</label>
            <input
              type="password"
              name="confirmar"
              className={'form-control ' + (errores.confirmar ? 'is-invalid' : '')}
              value={datos.confirmar}
              onChange={cambiar}
            />
            <div className="invalid-feedback">{errores.confirmar}</div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrarme</button>
        </form>
        <p className="mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};