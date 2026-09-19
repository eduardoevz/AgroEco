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
  CartesianGrid,
} from 'recharts';
import { Diagnosis } from '@/types';
import { BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

interface ChartsProps {
  diagnoses: Diagnosis[];
}

export const DashboardCharts: React.FC<ChartsProps> = ({ diagnoses }) => {
  // 1. Distribución por Enfermedad
  const diseaseCounts: Record<string, number> = {};
  diagnoses.forEach((d) => {
    diseaseCounts[d.predictedDiseaseName] = (diseaseCounts[d.predictedDiseaseName] || 0) + 1;
  });

  const barData = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name: name.length > 13 ? name.substring(0, 13) + '...' : name,
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
    { name: 'Detectado', value: statusCounts['Detectado'], color: '#E11D48' },
    { name: 'En seguimiento', value: statusCounts['En seguimiento'], color: '#D97706' },
    { name: 'Tratado', value: statusCounts['Tratado'], color: '#0284C7' },
    { name: 'Controlado', value: statusCounts['Controlado'], color: '#059669' },
  ].filter((item) => item.value > 0);

  const totalCases = diagnoses.length;

  if (diagnoses.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-600">
          Aún no hay suficientes diagnósticos para generar analítica fitosanitaria.
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Realiza tu primer escaneo asistido con IA para desbloquear las gráficas epidemiológicas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras: Enfermedades más frecuentes */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Patologías más Prevalentes
                </h4>
                <p className="text-[11px] text-slate-500">
                  Frecuencia de casos por afección diagnosticada
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }}
                  angle={-20}
                  textAnchor="end"
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                  cursor={{ fill: 'rgba(5, 150, 105, 0.06)' }}
                />
                <Bar
                  dataKey="cantidad"
                  fill="#059669"
                  radius={[8, 8, 2, 2]}
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico Circular: Distribución por Estado */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Distribución por Estado Sanitario
                </h4>
                <p className="text-[11px] text-slate-500">
                  Control de brotes y planes de contingencia
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {totalCases} totales
            </span>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={900}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Medallón central */}
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {totalCases}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Casos
              </span>
            </div>
          </div>
        </div>

        {/* Leyenda personalizada */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
          {pieData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate font-medium">{item.name}</span>
              </div>
              <strong className="text-slate-900 ml-1">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

