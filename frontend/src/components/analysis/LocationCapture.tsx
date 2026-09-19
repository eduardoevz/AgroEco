import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertTriangle, RefreshCw, Crosshair } from 'lucide-react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationCaptureProps {
  location: Coordinates | null;
  onLocationObtained: (coords: Coordinates) => void;
  onLocationSkipped: () => void;
  defaultCoords?: { latitude: number; longitude: number };
}

export const LocationCapture: React.FC<LocationCaptureProps> = ({
  location,
  onLocationObtained,
  onLocationSkipped,
  defaultCoords,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  const requestGeolocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorStatus('Tu navegador o dispositivo no soporta geolocalización GPS.');
      return;
    }

    setLoading(true);
    setErrorStatus(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        setSkipped(false);
        onLocationObtained({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        });
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorStatus('Permiso de GPS denegado por el usuario.');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorStatus('Señal de satélites GPS no disponible en este momento.');
            break;
          case error.TIMEOUT:
            setErrorStatus('Tiempo de espera agotado al consultar coordenadas satelitales.');
            break;
          default:
            setErrorStatus('No fue posible obtener la ubicación del dispositivo.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // Si no hay ubicación aún, intentar obtenerla automáticamente
    if (!location && !skipped && !errorStatus) {
      requestGeolocation();
    }
  }, []);

  const handleSkip = () => {
    setSkipped(true);
    if (defaultCoords) {
      // Usar coordenadas de la finca como aproximación
      onLocationObtained({
        latitude: defaultCoords.latitude,
        longitude: defaultCoords.longitude,
        accuracy: 100,
      });
    } else {
      onLocationSkipped();
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            location
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-stone-200 text-stone-700'
          }`}
        >
          <Crosshair className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-stone-900">
            Georreferenciación en Campo
          </h4>
          <p className="text-xs text-stone-500">
            Ubicación satelital del brote fitosanitario
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center space-y-1">
          <p className="text-xs font-semibold text-emerald-800">
            Conectando con satélites GPS...
          </p>
          <p className="text-[11px] text-emerald-600">
            Asegúrate de estar en un espacio exterior con vista al cielo.
          </p>
        </div>
      )}

      {location && !loading && (
        <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Coordenadas GPS fijadas
            </span>
            <span className="text-stone-500">
              Precisión: ±{location.accuracy}m
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-stone-50 p-2 rounded-lg border border-stone-100">
            <div>
              <span className="text-stone-400 block text-[10px]">LATITUD</span>
              <span className="font-semibold text-stone-800">{location.latitude}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">LONGITUD</span>
              <span className="font-semibold text-stone-800">{location.longitude}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={requestGeolocation}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 mt-1"
          >
            <RefreshCw className="w-3 h-3" />
            Actualizar posición
          </button>
        </div>
      )}

      {errorStatus && !loading && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{errorStatus}</span>
              <p className="text-[11px] text-amber-800 mt-1">
                El diagnóstico no podrá mostrarse con ubicación exacta en el mapa si continúas sin GPS.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={requestGeolocation}
              className="px-3 py-1.5 text-xs font-medium bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar GPS
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-stone-600 hover:text-stone-900 underline"
            >
              Continuar sin GPS exacto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
