import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrección de íconos por defecto de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const puntosRetiro = [
  {
    id: 1,
    nombre: 'Tienda Central Sonido Vivo (Casa Matriz)',
    direccion: 'Av. Libertad 745, Viña del Mar, Región de Valparaíso',
    horario: 'Lunes a Sábado: 10:00 - 19:30 hrs',
    tipo: 'Tienda Física y Retiro Inmediato',
    coords: [-33.0153, -71.5503],
  },
  {
    id: 2,
    nombre: 'Punto de Retiro Starken Viña Centro',
    direccion: 'Arlegui 645, Viña del Mar, Región de Valparaíso',
    horario: 'Lunes a Viernes: 09:00 - 18:30 hrs',
    tipo: 'Agencia Courier Asociada',
    coords: [-33.0245, -71.5518],
  },
  {
    id: 3,
    nombre: 'Punto de Retiro Chilexpress 1 Norte',
    direccion: 'Av. 1 Norte 421, Viña del Mar, Región de Valparaíso',
    horario: 'Lunes a Sábado: 09:30 - 19:00 hrs',
    tipo: 'Agencia Courier Asociada',
    coords: [-33.0212, -71.5562],
  },
];

export const Ubicacion = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [puntoActivo, setPuntoActivo] = useState(puntosRetiro[0]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView(puntosRetiro[0].coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    puntosRetiro.forEach((punto) => {
      L.marker(punto.coords)
        .addTo(map)
        .bindPopup(`<strong>${punto.nombre}</strong><br/>${punto.direccion}`);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const enfocarPunto = (punto) => {
    setPuntoActivo(punto);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(punto.coords, 16);
    }
  };

  return (
    <>
      <h2 className="mb-3">Ubicación de la Tienda y Puntos de Retiro</h2>
      <p className="text-muted mb-4">
        Visita nuestra casa matriz en Viña del Mar o selecciona un punto de retiro asociado para tus pedidos online.
      </p>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="list-group shadow-sm">
            {puntosRetiro.map((punto) => (
              <div
                key={punto.id}
                className={`list-group-item list-group-item-action ${
                  puntoActivo.id === punto.id ? 'active' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => enfocarPunto(punto)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1 fw-bold">{punto.nombre}</h6>
                </div>
                <p className="mb-1 small">{punto.direccion}</p>
                <small className="d-block mb-2">{punto.horario}</small>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${punto.coords[0]},${punto.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-sm ${
                    puntoActivo.id === punto.id ? 'btn-light' : 'btn-outline-primary'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Cómo llegar (Google Maps)
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-2">
              <div
                ref={mapContainerRef}
                style={{ height: '400px', width: '100%', borderRadius: '6px' }}
                aria-label="Mapa de ubicación Sonido Vivo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};