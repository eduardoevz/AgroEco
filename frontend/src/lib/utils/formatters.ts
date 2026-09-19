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
      return 'bg-red-100 text-red-800 border-red-200';
    case 'monitoring':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'treated':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'controlled':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'moderate':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'severe':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
