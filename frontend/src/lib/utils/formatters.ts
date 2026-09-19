import { DiagnosisStatus, SeverityLevel, PlantPart } from '@/types';

export function formatDate(dateString: string): string {
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatPercent(value: number): string {
  if (value === undefined || value === null) return '0%';
  const num = value <= 1 ? value * 100 : value;
  return `${Math.round(num)}%`;
}

export function getPlantPartLabel(part: PlantPart): string {
  const map: Record<PlantPart, string> = {
    leaf: 'Hoja',
    stem: 'Tallo',
    fruit: 'Fruto',
  };
  return map[part] || part;
}

export function getStatusLabel(status: DiagnosisStatus): string {
  const map: Record<DiagnosisStatus, string> = {
    detected: 'Detectado',
    monitoring: 'En seguimiento',
    treated: 'Tratado',
    controlled: 'Controlado',
  };
  return map[status] || status;
}

export function getStatusBadgeClasses(status: DiagnosisStatus): string {
  switch (status) {
    case 'detected':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    case 'monitoring':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'treated':
      return 'bg-sky-50 text-sky-700 border-sky-200/80';
    case 'controlled':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200/80';
  }
}

export function getSeverityLabel(severity: SeverityLevel): string {
  const map: Record<SeverityLevel, string> = {
    low: 'Leve / Bajo',
    moderate: 'Moderado',
    high: 'Alto',
    severe: 'Severo / Crítico',
  };
  return map[severity] || severity;
}

export function getSeverityBadgeClasses(severity: SeverityLevel): string {
  switch (severity) {
    case 'low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'moderate':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-200/80';
    case 'severe':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200/80';
  }
}
