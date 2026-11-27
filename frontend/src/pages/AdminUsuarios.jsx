import { useState } from 'react';

const formularioVacio = () => ({
  nombre: '',
  email: '',
  password: '',
  rol: 'Vendedor'
});

export const AdminUsuarios = ({
  usuarios,
  usuarioActual,
  crearUsuarioAdmin,
  actualizarUsuarioAdmin,
  toggleActivoUsuario
}) => {
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState(formularioVacio());

  const limpiarFormulario = () => {
    setEditandoId(null);
    setError('');
    setFormulario(formularioVacio());
  };

  const cargarParaEditar = (u) => {
    setEditandoId(u.id);
    setError('');
    setFormulario({
      nombre: u.nombre,
      email: u.email,
      password: '',
      rol: u.rol
    });
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (formulario.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formulario.email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    const correoDuplicado = usuarios.some(
      u => u.email === formulario.email.trim().toLowerCase() && u.id !== editandoId
    );
    if (correoDuplicado) {
      setError('Ese correo ya está registrado por otro usuario.');
      return;
    }
    if (!editandoId && formulario.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (editandoId && formulario.password !== '' && formulario.password.length < 6) {
      setError('La contraseña nueva debe tener al menos 6 caracteres.');
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      password: formulario.password,
      rol: formulario.rol
    };

    const mensajeError = editandoId
      ? await actualizarUsuarioAdmin({ id: editandoId, ...datos })
      : await crearUsuarioAdmin(datos);

    if (mensajeError) {
      setError(mensajeError);
      return;
    }
    limpiarFormulario();
  };

  return (
    <>
      <h2 className="mb-4">Administración de Usuarios y Roles</h2>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              {editandoId ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={manejarEnvio}>
                <div className="mb-2">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control form-control-sm"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-sm"
                    value={formulario.email}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-sm"
                    placeholder={editandoId ? 'Vacío para no cambiarla' : ''}
                    value={formulario.password}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rol del sistema</label>
                  <select
                    name="rol"
                    className="form-select form-select-sm"
                    value={formulario.rol}
                    onChange={manejarCambio}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary btn-sm w-100">
                    {editandoId ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={limpiarFormulario}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const esMismoAdmin = u.id === usuarioActual.id;
                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        <strong>{u.nombre}</strong>
                        <br />
                        <small className="text-muted">{u.email}</small>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.rol === 'Administrador'
                              ? 'bg-primary'
                              : u.rol === 'Vendedor'
                                ? 'bg-info text-dark'
                                : 'bg-secondary'
                          }`}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.activo ? 'bg-success' : 'bg-danger'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => cargarParaEditar(u)}
                          >
                            Editar
                          </button>
                          <button
                            className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => toggleActivoUsuario(u.id)}
                            disabled={esMismoAdmin}
                            title={esMismoAdmin ? 'No puedes desactivar tu propia cuenta' : ''}
                          >
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};