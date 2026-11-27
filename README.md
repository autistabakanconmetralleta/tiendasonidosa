# Tienda Sonido Vivo — Proyecto Semestral DSY1104

**Asignatura:** Desarrollo Full Stack II (DSY1104) · 2026-2
**Evaluación:** EP3 — Integrando backend y frontend a la tienda online
**Contexto:** Forma B — Tienda Sonido Vivo
**Integrantes:** Luciano Diaz, Luciano Roca

Tienda online de productos de audio y música. El frontend en React consume una API REST en Spring Boot, con base de datos PostgreSQL, autenticación JWT y control de acceso por roles.

## Estructura del repositorio

```
tiendasonidosa/
├── frontend/        React + Vite + Bootstrap
├── backend/         Spring Boot + JPA + Spring Security + JWT
├── documentacion/   Manual de usuario y documento de integración
└── docker-compose.yml   Base de datos PostgreSQL para ejecución local
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite, React Router, Bootstrap 5, Leaflet, Vitest |
| Backend | Java 21, Spring Boot, Spring Data JPA, Spring Security |
| Autenticación | JWT (jjwt 0.12.6), contraseñas con BCrypt |
| Base de datos | PostgreSQL 16 (Docker) |
| Documentación API | Swagger / OpenAPI (springdoc) |

## Requisitos previos

- Java 21
- Node.js 18 o superior y npm
- Docker Desktop (para la base de datos)

## Cómo ejecutar el proyecto

Se necesitan 3 terminales, en este orden.

### 1. Base de datos

En la raíz del repositorio:

```bash
docker compose up -d
```

Levanta PostgreSQL en el puerto **5435** con la base `sonidovivo`.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run        # Windows PowerShell: .\mvnw.cmd spring-boot:run
```

Queda disponible en `http://localhost:8080`. Al iniciar, Hibernate crea las tablas, se cargan 51 productos desde `data.sql` y se crean los usuarios de demostración.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Queda disponible en `http://localhost:5173`. La URL de la API se configura en `frontend/.env`:

```
VITE_API_URL=http://localhost:8080
```

## Variables de entorno del backend

Todas tienen un valor de demostración por defecto. Ver `backend/.env.example`.

| Variable | Descripción |
|---|---|
| `DB_URL` | URL JDBC de PostgreSQL |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave de firma del JWT (mínimo 32 caracteres) |

## Usuarios de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@sonidovivo.cl | admin123 |
| Vendedor | vendedor@sonidovivo.cl | vendedor123 |
| Cliente | cliente@sonidovivo.cl | cliente123 |

Son credenciales de demostración, sin datos reales.

## Documentación de la API (Swagger)

Con el backend en ejecución: **http://localhost:8080/swagger-ui.html**

Para probar endpoints protegidos: ejecutar `POST /api/auth/login`, copiar el `token`, pulsar **Authorize** y pegarlo.

## Endpoints principales

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/registro` | Público (crea un Cliente) |
| GET | `/api/productos`, `/api/productos/{id}` | Público |
| POST / PUT / DELETE | `/api/productos` | Administrador |
| PATCH | `/api/productos/{id}/stock` | Vendedor, Administrador |
| POST | `/api/pedidos` | Cliente |
| GET | `/api/pedidos/mios` | Usuario autenticado |
| GET | `/api/pedidos` | Vendedor, Administrador |
| PATCH | `/api/pedidos/{id}/estado` | Vendedor, Administrador |
| GET / POST / PUT / DELETE | `/api/usuarios` | Administrador |

## Roles y acceso en el frontend

| Ruta | Roles permitidos |
|---|---|
| `/`, `/carrito`, `/ubicacion`, `/login`, `/registro` | Todos |
| `/mis-pedidos` | Cliente |
| `/gestion-tienda` | Vendedor, Administrador |
| `/admin-usuarios` | Administrador |

El backend valida los permisos de forma independiente en cada petición.

## Sesión

El token y los datos del usuario se guardan en `localStorage`. Al recargar la página se restaura la sesión si el token sigue vigente. Si el token venció o el servidor responde 401, se cierra la sesión y se redirige a `/login`.

## Pruebas del frontend

```bash
cd frontend
npm test
```

## Documentación adicional

- `documentacion/Manual_de_usuario.docx`
- `documentacion/Documento_de_integracion.docx`
