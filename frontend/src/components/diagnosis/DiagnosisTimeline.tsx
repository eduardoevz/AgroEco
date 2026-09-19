'use client';

import React, { useState } from 'react';
import { FollowUp, DiagnosisStatus } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { DiagnosisStatusBadge } from '@/components/ui/DiagnosisStatusBadge';
import { Plus, Check, Clock, Camera, AlertCircle, Calendar, Sparkles } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Línea de Tiempo y Evolución en Campo
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Historial de intervenciones y tratamientos aplicados
            </p>
          </div>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
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
          className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nuevo Registro de Seguimiento Fitosanitario
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Actualización clínica
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Actualizar Estado Sanitario
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['detected', 'monitoring', 'treated', 'controlled'] as DiagnosisStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNewStatus(st)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      newStatus === st
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-100/60'
                    }`}
                  >
                    <DiagnosisStatusBadge status={st} showIcon={false} />
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Acción ejecutada / Tratamiento agronómico aplicado *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Se aplicó trichoderma + caldo bordelés y deshoje sanitario. Disminuyó el avance de la mancha..."
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Evidencia fotográfica complementaria (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/60">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Avance'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Seguimientos (Timeline) */}
      <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {followUps.length === 0 ? (
          <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs text-slate-500 font-medium text-center">
            No se han registrado seguimientos o intervenciones posteriores para este diagnóstico.
          </div>
        ) : (
          followUps.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Punto indicador del timeline */}
              <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-emerald-600 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-2.5 hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <DiagnosisStatusBadge status={item.status} />
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.notes}
                </p>
                {item.imageUrl && (
                  <div className="pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt="Evidencia fotográfica de seguimiento"
                      className="w-36 h-36 object-cover rounded-2xl border border-slate-200 shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

