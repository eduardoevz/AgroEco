'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Diagnosis, Farm, Plot, Crop } from '@/types';
import { formatDate, formatPercent, getSeverityLabel, getStatusLabel } from '@/lib/utils/formatters';

interface DiagnosisMapInnerProps {
  diagnoses: Diagnosis[];
  farms: Farm[];
  plots: Plot[];
  crops: Crop[];
  selectedDiagnosisId?: string;
  viewMode: 'markers' | 'heatmap';
}

interface GeoGroup {
  centerLat: number;
  centerLng: number;
  items: Diagnosis[];
}

const getCropEmoji = (cropId?: string): string => {
  if (!cropId) return '🌱';
  const id = cropId.toLowerCase();
  if (id.includes('cafe')) return '☕';
  if (id.includes('maiz')) return '🌽';
  if (id.includes('arroz')) return '🌾';
  if (id.includes('frijol')) return '🫘';
  if (id.includes('tomate')) return '🍅';
  if (id.includes('platano')) return '🍌';
  return '🌱';
};

const getMarkerColor = (diagnosis: Diagnosis) => {
  if (diagnosis.status === 'controlled' || diagnosis.severity === 'low') {
    return { bg: '#15803d', border: '#14532d', label: 'Bajo / Controlado' };
  }
  if (diagnosis.status === 'treated' || diagnosis.severity === 'moderate') {
    return { bg: '#d97706', border: '#b45309', label: 'Moderado / Tratado' };
  }
  return { bg: '#dc2626', border: '#991b1b', label: 'Relevante / Detectado' };
};

function groupDiagnosesByProximity(
  items: Diagnosis[],
  thresholdDegrees = 0.00018
): GeoGroup[] {
  const groups: GeoGroup[] = [];

  items.forEach((item) => {
    const group = groups.find((g) => {
      const dLat = Math.abs(g.centerLat - item.latitude);
      const dLng = Math.abs(g.centerLng - item.longitude);
      return Math.sqrt(dLat * dLat + dLng * dLng) < thresholdDegrees;
    });

    if (group) {
      group.items.push(item);
    } else {
      groups.push({
        centerLat: item.latitude,
        centerLng: item.longitude,
        items: [item],
      });
    }
  });

  return groups;
}

export const DiagnosisMapInner: React.FC<DiagnosisMapInnerProps> = ({
  diagnoses,
  farms,
  plots,
  crops,
  selectedDiagnosisId,
  viewMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Coordenadas iniciales: centro de finca o punto geográfico
      const initialLat = farms[0]?.latitude || 12.1409;
      const initialLng = farms[0]?.longitude || -86.2125;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores o círculos de calor cuando cambian datos o viewMode
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const validDiagnoses = diagnoses.filter(
      (d) => d.latitude && d.longitude && !isNaN(d.latitude) && !isNaN(d.longitude)
    );

    if (validDiagnoses.length === 0) return;

    const bounds = L.latLngBounds([]);
    let targetMarkerToOpen: L.Marker | null = null;
    let targetCoords: [number, number] | null = null;

    if (viewMode === 'markers') {
      const groups = groupDiagnosesByProximity(validDiagnoses);

      groups.forEach((group) => {
        const isMulti = group.items.length > 1;

        // Si hay múltiples análisis en este mismo punto, colocar un ancla central con el total
        if (isMulti) {
          const centerIcon = L.divIcon({
            className: 'custom-center-pin',
            html: `
              <div style="
                background-color: #1e293b;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 800;
                font-size: 11px;
                cursor: default;
              " title="${group.items.length} análisis en este punto GPS">
                ${group.items.length}
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const centerMarker = L.marker([group.centerLat, group.centerLng], {
            icon: centerIcon,
            zIndexOffset: -5,
          });
          centerMarker.bindTooltip(
            `📍 Punto con ${group.items.length} análisis fitosanitarios`,
            { direction: 'bottom', offset: [0, 8] }
          );
          layerGroup.addLayer(centerMarker);
          bounds.extend([group.centerLat, group.centerLng]);
        }

        group.items.forEach((d, idx) => {
          const color = getMarkerColor(d);
          const crop = crops.find((c) => c.id === d.cropId);
          const plot = plots.find((p) => p.id === d.plotId);
          const farm = farms.find((f) => f.id === d.farmId);
          const cropEmoji = getCropEmoji(d.cropId);
          const isSelected = selectedDiagnosisId === d.id;

          // Cálculo de coordenadas con separación radial (Spiderfying) si coinciden
          let markerLat = d.latitude;
          let markerLng = d.longitude;

          if (isMulti) {
            const N = group.items.length;
            const radius = N <= 3 ? 0.00025 : 0.00032;
            const angle = (2 * Math.PI * idx) / N - Math.PI / 2;
            const latOffset = radius * Math.sin(angle);
            const lngOffset =
              (radius * Math.cos(angle)) /
              Math.cos((group.centerLat * Math.PI) / 180);

            markerLat = group.centerLat + latOffset;
            markerLng = group.centerLng + lngOffset;

            // Línea conectora punteada desde el punto GPS real hasta el marcador individual
            const connectorLine = L.polyline(
              [
                [group.centerLat, group.centerLng],
                [markerLat, markerLng],
              ],
              {
                color: '#64748b',
                weight: 1.5,
                dashArray: '3, 4',
                opacity: 0.7,
              }
            );
            layerGroup.addLayer(connectorLine);
          }

          const markerIcon = L.divIcon({
            className: 'custom-crop-marker',
            html: `
              <div style="
                position: relative;
                background-color: ${color.bg};
                border: 2.5px solid white;
                box-shadow: ${
                  isSelected
                    ? '0 0 0 4px #10b981, 0 6px 14px rgba(0,0,0,0.45)'
                    : '0 3px 8px rgba(0,0,0,0.3)'
                };
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                cursor: pointer;
              ">
                <span>${cropEmoji}</span>
                ${
                  isMulti
                    ? `
                  <span style="
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: #0f172a;
                    color: white;
                    font-size: 9px;
                    font-weight: 800;
                    border-radius: 999px;
                    padding: 0px 4px;
                    border: 1.5px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
                  ">
                    ${idx + 1}
                  </span>
                `
                    : ''
                }
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20],
          });

          const marker = L.marker([markerLat, markerLng], {
            icon: markerIcon,
            zIndexOffset: isSelected ? 100 : 10,
          });

          const popupContent = `
            <div style="font-family: inherit; font-size: 12px; min-width: 250px; max-width: 290px; padding: 4px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #15803d; letter-spacing: 0.5px;">
                  ${cropEmoji} ${crop?.name || d.cropId} · ${plot?.name || 'Parcela'}
                </span>
                ${
                  isMulti
                    ? `<span style="font-size: 9px; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 999px;">Muestra ${idx + 1} de ${group.items.length}</span>`
                    : ''
                }
              </div>

              <h4 style="font-size: 14px; font-weight: 700; margin: 2px 0 6px 0; color: #1c1917;">
                ${d.predictedDiseaseName}
              </h4>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; margin-bottom: 8px; font-size: 11px; color: #334155; line-height: 1.5;">
                <div><strong>Certeza IA:</strong> ${formatPercent(d.confidence)}</div>
                <div><strong>Severidad:</strong> ${getSeverityLabel(d.severity)}</div>
                <div><strong>Estado:</strong> ${getStatusLabel(d.status)}</div>
                <div><strong>Fecha:</strong> ${formatDate(d.createdAt)}</div>
                <div><strong>Finca:</strong> ${farm?.name || 'Finca'}</div>
              </div>

              <a href="/history/${d.id}" style="
                display: block;
                background-color: #15803d;
                color: white;
                text-align: center;
                padding: 7px 12px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 11px;
                margin-bottom: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
              ">
                Ver detalle y seguimiento
              </a>

              ${
                isMulti
                  ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 10px;">
                  <div style="font-weight: 700; margin-bottom: 5px; color: #475569;">
                    Otros análisis en este mismo punto (${group.items.length - 1}):
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${group.items
                      .filter((other) => other.id !== d.id)
                      .map((other) => {
                        const otherEmoji = getCropEmoji(other.cropId);
                        return `
                          <a href="/map?diagnosisId=${other.id}" style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            text-decoration: none;
                            color: #1e293b;
                            background: #f1f5f9;
                            padding: 4px 8px;
                            border-radius: 6px;
                            border: 1px solid #e2e8f0;
                          ">
                            <span style="font-weight: 600;">${otherEmoji} ${other.predictedDiseaseName}</span>
                            <span style="font-size: 9px; color: #64748b;">${formatDate(other.createdAt).split(',')[0]}</span>
                          </a>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }
            </div>
          `;

          marker.bindPopup(popupContent);
          layerGroup.addLayer(marker);
          bounds.extend([markerLat, markerLng]);

          if (isSelected) {
            targetMarkerToOpen = marker;
            targetCoords = [markerLat, markerLng];
          }
        });
      });
    } else {
      // Modo Mapa de Concentración / Calor (Círculos difusos concéntricos de intensidad)
      validDiagnoses.forEach((d) => {
        const radius = d.severity === 'severe' ? 90 : d.severity === 'high' ? 65 : 45;
        const color = getMarkerColor(d);
        const cropEmoji = getCropEmoji(d.cropId);

        const circle = L.circle([d.latitude, d.longitude], {
          color: color.border,
          fillColor: color.bg,
          fillOpacity: 0.35,
          radius: radius,
          weight: 1,
        });

        circle.bindTooltip(
          `${cropEmoji} ${d.predictedDiseaseName} (${formatPercent(d.confidence)})`,
          {
            permanent: false,
            direction: 'top',
          }
        );

        layerGroup.addLayer(circle);
        bounds.extend([d.latitude, d.longitude]);
      });
    }

    if (targetMarkerToOpen && targetCoords) {
      map.setView(targetCoords, 17, { animate: true });
      setTimeout(() => {
        targetMarkerToOpen?.openPopup();
      }, 350);
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [diagnoses, viewMode, selectedDiagnosisId, farms, plots, crops]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-stone-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px] z-0" />

      {/* Leyenda interactiva sobre el mapa */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-md border border-stone-200 text-xs space-y-2 max-w-[220px]">
        <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wider">
          Semáforo Fitosanitario
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-sm flex-shrink-0" />
          <span className="text-stone-700 text-[11px]">Relevante / Detectado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm flex-shrink-0" />
          <span className="text-stone-700 text-[11px]">Moderado / Tratado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-sm flex-shrink-0" />
          <span className="text-stone-700 text-[11px]">Bajo / Controlado</span>
        </div>

        <div className="pt-2 border-t border-stone-200 space-y-1 text-[10px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0">
              #
            </span>
            <span>Puntos con múltiples análisis</span>
          </div>
          <p className="text-[9px] text-stone-400 italic">
            Separados radialmente para ver cada muestra individualmente.
          </p>
        </div>
      </div>
    </div>
  );
};
export default DiagnosisMapInner;
