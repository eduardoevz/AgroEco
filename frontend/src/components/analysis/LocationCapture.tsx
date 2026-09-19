import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertTriangle, RefreshCw, Crosshair, Navigation, Satellite } from 'lucide-react';

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
    <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            location
              ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          <Crosshair className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Geolocalización Satelital GNSS
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Fijación de coordenadas para el mapa epidemiológico
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl text-center space-y-1.5 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
            <Satellite className="w-4 h-4 animate-bounce text-emerald-600" />
            <span>Sintonizando satélites GPS/GLONASS...</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            Asegúrate de permitir el acceso a tu ubicación y tener vista al cielo.
          </p>
        </div>
      )}

      {location && !loading && (
        <div className="p-4 bg-white border border-emerald-200/80 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Coordenadas GPS fijadas con precisión
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              ±{location.accuracy}m
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold tracking-wider">LATITUD</span>
              <span className="font-bold text-slate-800 text-sm">{location.latitude}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold tracking-wider">LONGITUD</span>
              <span className="font-bold text-slate-800 text-sm">{location.longitude}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={requestGeolocation}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1.5 mt-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalibrar posición satelital
          </button>
        </div>
      )}

      {errorStatus && !loading && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{errorStatus}</span>
              <p className="text-[11px] text-amber-800 mt-1 font-medium">
                Sin coordenadas precisas, se asociará la ubicación aproximada de la finca seleccionada.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={requestGeolocation}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
            >
              Continuar con coordenadas de la finca
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

