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
      <div className="flex items-center gap-2">
        <Link
          href="/farms"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Fincas</span>
        </Link>
      </div>

      <PageTitle
        title={farm.name}
        subtitle={`${farm.municipality}, ${farm.department} · ${farm.area} ${farm.areaUnit}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/analyze?farmId=${farm.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm"
            >
              <ScanLine className="w-4 h-4" />
              <span>Analizar en esta Finca</span>
            </Link>
            <button
              type="button"
              onClick={openCreatePlotModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Parcela</span>
            </button>
          </div>
        }
      />

      {/* Tarjeta de Resumen del Predio */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Ubicación Geográfica
            </span>
            <p className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              {farm.municipality}, {farm.department}
            </p>
            <p className="text-[11px] font-mono text-stone-500 mt-1">
              Lat: {farm.latitude.toFixed(4)}, Lon: {farm.longitude.toFixed(4)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Capacidad & Lotes
            </span>
            <p className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              {farm.area} {farm.areaUnit} totales
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {plots.length} parcela{plots.length === 1 ? '' : 's'} sembrada{plots.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Sanidad Fitosanitaria
            </span>
            <p className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-700" />
              {diagnoses.length} análisis registrados
            </p>
            <Link
              href={`/map?farmId=${farm.id}`}
              className="text-[11px] font-semibold text-emerald-700 hover:underline mt-1 block"
            >
              Ver brotes de esta finca en el mapa →
            </Link>
          </div>
        </div>

        {farm.description && (
          <p className="text-xs text-stone-600 mt-4 pt-4 border-t border-stone-100">
            {farm.description}
          </p>
        )}
      </div>

      {/* Sección de Parcelas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Parcelas y Lotes de Producción
          </h3>
          <span className="text-xs text-stone-500">
            {plots.length} configurada{plots.length === 1 ? '' : 's'}
          </span>
        </div>

        {plots.length === 0 ? (
          <EmptyState
            title="Esta finca no tiene parcelas aún"
            description="Agrega parcelas y asócialas a cultivos específicos (plátano, café, maíz, etc.) para comenzar los análisis."
            actionText="Crear Primera Parcela"
            onAction={openCreatePlotModal}
            icon={<Sprout className="w-7 h-7" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">
                {editingPlot ? 'Editar Parcela' : 'Crear Parcela'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPlotModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePlotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nombre de la Parcela / Lote *
                </label>
                <input
                  type="text"
                  required
                  value={plotForm.name}
                  onChange={(e) => setPlotForm({ ...plotForm, name: e.target.value })}
                  placeholder="Ej: Lote Dominico Hartón"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Cultivo Sembrado *
                </label>
                <select
                  value={plotForm.cropId}
                  onChange={(e) => setPlotForm({ ...plotForm, cropId: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  <label className="block font-semibold text-stone-700 mb-1">
                    Área *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={plotForm.area}
                    onChange={(e) => setPlotForm({ ...plotForm, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Unidad
                  </label>
                  <select
                    value={plotForm.areaUnit}
                    onChange={(e) => setPlotForm({ ...plotForm, areaUnit: e.target.value as AreaUnit })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ha">Hectáreas (ha)</option>
                    <option value="m2">Metros cuadrados (m²)</option>
                    <option value="mz">Manzanas (mz)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descripción / Variedad (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={plotForm.description}
                  onChange={(e) => setPlotForm({ ...plotForm, description: e.target.value })}
                  placeholder="Etapa vegetativa, clon, densidad..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPlotModalOpen(false)}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingPlot ? 'Actualizar Parcela' : 'Crear Parcela'}
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
        confirmText="Eliminar Parcela"
        isDestructive={true}
        onConfirm={handleDeletePlot}
        onCancel={() => setPlotToDelete(null)}
      />
    </div>
  );
}
