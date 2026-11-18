import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Ubicacion } from '../pages/Ubicacion';

const flyToMock = vi.fn();

vi.mock('leaflet', () => {
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    flyTo: (...args) => flyToMock(...args),
    remove: vi.fn(),
  };
  const markerMock = {
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
  };
  return {
    default: {
      Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
      map: vi.fn(() => mapMock),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      marker: vi.fn(() => markerMock),
    },
  };
});

describe('Vista Ubicación y Mapa Interactivo', () => {
  it('renderiza los puntos de retiro y enfoca el mapa al seleccionarlos', () => {
    render(<Ubicacion />);

    expect(screen.getByText(/Tienda Central Sonido Vivo/i)).toBeInTheDocument();
    const puntoStarken = screen.getByText(/Punto de Retiro Starken Viña Centro/i);

    fireEvent.click(puntoStarken);
    expect(flyToMock).toHaveBeenCalledWith([-33.0245, -71.5518], 16);
  });
});