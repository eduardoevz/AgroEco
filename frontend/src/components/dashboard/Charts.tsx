'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Diagnosis } from '@/types';

interface ChartsProps {
  diagnoses: Diagnosis[];
}

export const DashboardCharts: React.FC<ChartsProps> = ({ diagnoses }) => {
  // 1. Distribución por Enfermedad
  const diseaseCounts: Record<string, number> = {};
  diagnoses.forEach((d) => {
    diseaseCounts[d.predictedDiseaseName] = (diseaseCounts[d.predictedDiseaseName] || 0) + 1;
  });

  const barData = Object.entries(diseaseCounts).map(([name, count]) => ({
    name: name.length > 14 ? name.substring(0, 14) + '...' : name,
    fullName: name,
    cantidad: count,
  }));

  // 2. Distribución por Estado
  const statusCounts = {
    Detectado: 0,
    'En seguimiento': 0,
    Tratado: 0,
    Controlado: 0,
  };

  diagnoses.forEach((d) => {
    if (d.status === 'detected') statusCounts['Detectado']++;
    else if (d.status === 'monitoring') statusCounts['En seguimiento']++;
    else if (d.status === 'treated') statusCounts['Tratado']++;
    else if (d.status === 'controlled') statusCounts['Controlado']++;
  });

  const pieData = [
    { name: 'Detectado', value: statusCounts['Detectado'], color: '#dc2626' },
    { name: 'En seguimiento', value: statusCounts['En seguimiento'], color: '#d97706' },
    { name: 'Tratado', value: statusCounts['Tratado'], color: '#2563eb' },
    { name: 'Controlado', value: statusCounts['Controlado'], color: '#15803d' },
  ].filter((item) => item.value > 0);

  if (diagnoses.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
        Aún no hay suficientes diagnósticos para generar gráficos estadísticos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras: Enfermedades más frecuentes */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
          Frecuencia de Patologías Detectadas
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} angle={-25} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e7e5e4',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="cantidad" fill="#15803d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico Circular: Distribución por Estado de Seguimiento */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
            Distribución por Estado Sanitario
          </h4>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e7e5e4',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leyenda del gráfico circular */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-xs">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-stone-600 truncate">{item.name}:</span>
              <strong className="text-stone-900">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
