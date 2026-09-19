'use client';

import React, { useState } from 'react';
import { FollowUp, DiagnosisStatus } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { DiagnosisStatusBadge } from '@/components/ui/DiagnosisStatusBadge';
import { Plus, Check, Clock, Camera, AlertCircle } from 'lucide-react';
import { addFollowUp } from '@/lib/firebase/firestore';
import { uploadFollowUpImage } from '@/lib/firebase/storage';
import { useAuth } from '@/context/AuthContext';

interface DiagnosisTimelineProps {
  diagnosisId: string;
  currentStatus: DiagnosisStatus;
  followUps: FollowUp[];
  onFollowUpAdded: (newFollowUp: FollowUp) => void;
}

export const DiagnosisTimeline: React.FC<DiagnosisTimelineProps> = ({
  diagnosisId,
  currentStatus,
  followUps,
  onFollowUpAdded,
}) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newStatus, setNewStatus] = useState<DiagnosisStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setErrorMsg('Por favor describe las acciones o evolución del cultivo.');
      return;
    }
    if (!user) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      let imageUrl: string | undefined = undefined;
      if (selectedFile) {
        imageUrl = await uploadFollowUpImage(selectedFile, user.id, 'fol-' + Date.now());
      }

      const created = await addFollowUp({
        diagnosisId,
        userId: user.id,
        status: newStatus,
        notes: notes.trim(),
        imageUrl,
      });

      onFollowUpAdded(created);
      setNotes('');
      setSelectedFile(null);
      setShowForm(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar seguimiento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>Línea de Tiempo de Evolución</span>
        </h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Avance</span>
          </button>
        )}
      </div>

      {/* Formulario para agregar seguimiento */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4"
        >
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Nuevo Registro de Seguimiento
          </h4>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Actualizar Estado del Brote
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['detected', 'monitoring', 'treated', 'controlled'] as DiagnosisStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNewStatus(st)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      newStatus === st
                        ? 'border-emerald-700 bg-emerald-100 text-emerald-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <DiagnosisStatusBadge status={st} showIcon={false} />
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Notas de campo / Tratamiento aplicado
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Se aplicó caldo bordelés y deshoje sanitario. La lesión detuvo su avance..."
              className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Fotografía de evolución (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="text-xs text-stone-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Avance'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Seguimientos (Timeline) */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {followUps.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Punto indicador del timeline */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-emerald-600">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <DiagnosisStatusBadge status={item.status} />
                <span className="text-[11px] font-medium text-stone-400">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {item.notes}
              </p>
              {item.imageUrl && (
                <div className="pt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt="Evidencia fotográfica de seguimiento"
                    className="w-32 h-32 object-cover rounded-xl border border-stone-200"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
