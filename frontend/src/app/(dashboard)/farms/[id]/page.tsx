'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getFarmById,
  getPlotsByFarm,
  getCrops,
  createPlot,
  updatePlot,
  deletePlot,
  getDiagnoses,
} from '@/lib/firebase/firestore';
import { Farm, Plot, Crop, Diagnosis, AreaUnit } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { PlotCard } from '@/components/farms/PlotCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  MapPin,
  Layers,
  ScanLine,
  Plus,
  ArrowLeft,
  X,
  Sprout,
  AlertCircle,
  Activity,
} from 'lucide-react';

export default function FarmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const farmId = params?.id as string;
  const { user } = useAuth();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Parcela
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [plotForm, setPlotForm] = useState({
    name: '',
    description: '',
    cropId: 'platano',
    area: 2,
    areaUnit: 'ha' as AreaUnit,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [plotToDelete, setPlotToDelete] = useState<Plot | null>(null);

  const loadData = async () => {
    if (!farmId || !user) return;
    try {
      const [f, p, c, d] = await Promise.all([
        getFarmById(farmId),
        getPlotsByFarm(farmId),
        getCrops(),
        getDiagnoses(user.id, { farmId }),
      ]);
      setFarm(f);
      setPlots(p);
      setCrops(c);
      setDiagnoses(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [farmId, user]);

  const openCreatePlotModal = () => {
    setEditingPlot(null);
    setPlotForm({
      name: '',
      description: '',
      cropId: crops[0]?.id || 'platano',
      area: 2,
      areaUnit: farm?.areaUnit || 'ha',
    });
    setErrorMsg(null);
    setIsPlotModalOpen(true);
  };

  const openEditPlotModal = (plot: Plot) => {
    setEditingPlot(plot);
    setPlotForm({
      name: plot.name,
      description: plot.description || '',
      cropId: plot.cropId,
      area: plot.area,
      areaUnit: plot.areaUnit,
    });
    setErrorMsg(null);
    setIsPlotModalOpen(true);
  };

  const handlePlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotForm.name || !plotForm.cropId) {
      setErrorMsg('Por favor completa el nombre y el cultivo de la parcela.');
      return;
    }
    if (!user || !farm) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (editingPlot) {
        await updatePlot(editingPlot.id, plotForm);
      } else {
        await createPlot({
          ...plotForm,
          farmId: farm.id,
          ownerId: user.id,
        });
      }
      setIsPlotModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error guardando parcela.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlot = async () => {
    if (!plotToDelete) return;
    try {
      await deletePlot(plotToDelete.id);
      setPlotToDelete(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Cargando detalles del predio y parcelas..." />;
  }

  if (!farm) {
    return (
      <EmptyState
        title="Finca no encontrada"
        description="El predio seleccionado no existe o no tienes permisos para visualizarlo."
        actionText="Volver a Mis Fincas"
        onAction={() => router.push('/farms')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/farms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Fincas</span>
        </Link>
      </div>

      <PageTitle
        title={farm.name}
        subtitle={`${farm.municipality}, ${farm.department} · ${farm.area} ${farm.areaUnit} de extensión`}
        action={
          <div className="flex items-center gap-2.5">
            <Link
              href={`/analyze?farmId=${farm.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
            >
              <ScanLine className="w-4 h-4" />
              <span>Analizar en esta Finca</span>
            </Link>
            <button
              type="button"
              onClick={openCreatePlotModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Nueva Parcela</span>
            </button>
          </div>
        }
      />

      {/* Tarjeta de Resumen del Predio */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Ubicación Geográfica
            </span>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {farm.municipality}, {farm.department}
            </p>
            <p className="text-xs font-mono text-slate-500">
              Lat: {farm.latitude.toFixed(4)}, Lon: {farm.longitude.toFixed(4)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Capacidad & Lotes
            </span>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              {farm.area} {farm.areaUnit} totales
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {plots.length} parcela{plots.length === 1 ? '' : 's'} sembrada{plots.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sanidad Fitosanitaria
            </span>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              {diagnoses.length} análisis registrados
            </p>
            <Link
              href={`/map?farmId=${farm.id}`}
              className="text-xs font-bold text-emerald-700 hover:underline inline-block pt-0.5"
            >
              Explorar brotes en el mapa →
            </Link>
          </div>
        </div>

        {farm.description && (
          <p className="text-xs text-slate-600 mt-5 pt-4 border-t border-slate-100 font-normal leading-relaxed">
            {farm.description}
          </p>
        )}
      </div>

      {/* Sección de Parcelas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Parcelas y Lotes de Producción
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Divisiones del predio por variedad de cultivo
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {plots.length} registradas
          </span>
        </div>

        {plots.length === 0 ? (
          <EmptyState
            title="Esta finca aún no tiene parcelas creadas"
            description="Agrega parcelas y asócialas a cultivos específicos (plátano, café, maíz, etc.) para comenzar los análisis fitosanitarios."
            actionText="Crear Primera Parcela"
            onAction={openCreatePlotModal}
            icon={<Sprout className="w-8 h-8" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plots.map((p) => (
              <PlotCard
                key={p.id}
                plot={p}
                crop={crops.find((c) => c.id === p.cropId)}
                onEdit={openEditPlotModal}
                onDelete={(plot) => setPlotToDelete(plot)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Crear / Editar Parcela */}
      {isPlotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingPlot ? 'Editar Parcela' : 'Crear Nueva Parcela'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Configura el cultivo y la superficie del lote
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlotModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePlotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Nombre de la Parcela / Lote *
                </label>
                <input
                  type="text"
                  required
                  value={plotForm.name}
                  onChange={(e) => setPlotForm({ ...plotForm, name: e.target.value })}
                  placeholder="Ej: Lote Dominico Hartón"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Cultivo Sembrado *
                </label>
                <select
                  value={plotForm.cropId}
                  onChange={(e) => setPlotForm({ ...plotForm, cropId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.scientificName ? `(${c.scientificName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Área *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={plotForm.area}
                    onChange={(e) => setPlotForm({ ...plotForm, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Unidad
                  </label>
                  <select
                    value={plotForm.areaUnit}
                    onChange={(e) => setPlotForm({ ...plotForm, areaUnit: e.target.value as AreaUnit })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                  >
                    <option value="ha">Hectáreas (ha)</option>
                    <option value="m2">Metros cuadrados (m²)</option>
                    <option value="fanegada">Fanegadas</option>
                    <option value="cuadra">Cuadras</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Descripción / Variedad (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={plotForm.description}
                  onChange={(e) => setPlotForm({ ...plotForm, description: e.target.value })}
                  placeholder="Etapa vegetativa, clon, densidad..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlotModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingPlot ? 'Guardar Cambios' : 'Crear Parcela'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diálogo Confirmar Eliminación de Parcela */}
      <ConfirmDialog
        isOpen={!!plotToDelete}
        title="¿Eliminar parcela?"
        message={`¿Deseas eliminar la parcela "${plotToDelete?.name}"?`}
        confirmText="Sí, Eliminar Parcela"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeletePlot}
        onCancel={() => setPlotToDelete(null)}
      />
    </div>
  );
}

