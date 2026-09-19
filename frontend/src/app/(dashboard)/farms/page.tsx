'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFarms, getPlotsByOwner, createFarm, updateFarm, deleteFarm } from '@/lib/firebase/firestore';
import { Farm, Plot, AreaUnit } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { FarmCard } from '@/components/farms/FarmCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Plus, Trees, X, AlertCircle } from 'lucide-react';

export default function FarmsPage() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal crear/editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    municipality: '',
    area: 1,
    areaUnit: 'ha' as AreaUnit,
    latitude: 4.5389,
    longitude: -75.6757,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dialog eliminar
  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);

  const loadData = async () => {
    if (!user) return;
    try {
      const [f, p] = await Promise.all([getFarms(user.id), getPlotsByOwner(user.id)]);
      setFarms(f);
      setPlots(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openCreateModal = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      description: '',
      department: 'Quindío',
      municipality: 'Armenia',
      area: 10,
      areaUnit: 'ha',
      latitude: 4.5389,
      longitude: -75.6757,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      description: farm.description || '',
      department: farm.department,
      municipality: farm.municipality,
      area: farm.area,
      areaUnit: farm.areaUnit,
      latitude: farm.latitude,
      longitude: farm.longitude,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.municipality) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }
    if (!user) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, formData);
      } else {
        await createFarm({
          ...formData,
          ownerId: user.id,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar finca.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!farmToDelete) return;
    try {
      await deleteFarm(farmToDelete.id);
      setFarmToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Error eliminando finca:', err);
    }
  };

  if (loading) {
    return <LoadingState message="Cargando tus fincas agrícolas..." />;
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Mis Fincas y Predios"
        subtitle="Administra la infraestructura territorial, geolocalización y parcelas agrícolas"
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Finca</span>
          </button>
        }
      />

      {farms.length === 0 ? (
        <EmptyState
          title="Aún no tienes fincas registradas"
          description="Crea tu primer predio agrícola para organizar tus parcelas y habilitar los análisis fitosanitarios por IA."
          actionText="Registrar Primera Finca"
          onAction={openCreateModal}
          icon={<Trees className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((f) => {
            const plotCount = plots.filter((p) => p.farmId === f.id).length;
            return (
              <FarmCard
                key={f.id}
                farm={f}
                plotsCount={plotCount}
                onEdit={openEditModal}
                onDelete={(farm) => setFarmToDelete(farm)}
              />
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Finca */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingFarm ? 'Editar Datos del Predio' : 'Registrar Nuevo Predio'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Información agronómica y coordenadas base de la finca
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Nombre de la Finca / Predio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Finca La Esperanza"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Descripción agronómica (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Cultivos principales, tipo de suelo, altitud..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Ej: Quindío"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Municipio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    placeholder="Ej: Armenia"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Área Total *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Unidad de Medida
                  </label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as AreaUnit })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                  >
                    <option value="ha">Hectáreas (ha)</option>
                    <option value="m2">Metros cuadrados (m²)</option>
                    <option value="fanegada">Fanegadas</option>
                    <option value="cuadra">Cuadras</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Latitud GNSS
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Longitud GNSS
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingFarm ? 'Guardar Cambios' : 'Crear Finca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Confirmar Eliminación */}
      <ConfirmDialog
        isOpen={!!farmToDelete}
        title="¿Eliminar esta finca?"
        message={`Esta acción eliminará "${farmToDelete?.name}". Se mantendrán las parcelas y diagnósticos existentes o se desasociarán según el esquema.`}
        confirmText="Sí, Eliminar Finca"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setFarmToDelete(null)}
      />
    </div>
  );
}
