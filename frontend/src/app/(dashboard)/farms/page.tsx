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
        title="Mis Fincas"
        subtitle="Administra tus predios agrícolas, límites y ubicación geográfica"
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Finca</span>
          </button>
        }
      />

      {farms.length === 0 ? (
        <EmptyState
          title="Aún no tienes fincas registradas"
          description="Crea tu primer predio agrícola para organizar tus parcelas y análisis fitosanitarios."
          actionText="Registrar Primera Finca"
          onAction={openCreateModal}
          icon={<Trees className="w-7 h-7" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">
                {editingFarm ? 'Editar Finca' : 'Registrar Nueva Finca'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nombre de la Finca *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Finca La Esperanza"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Cultivos principales, características de suelo..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Ej: Quindío"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Municipio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    placeholder="Ej: Armenia"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Área Total *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as AreaUnit })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ha">Hectáreas (ha)</option>
                    <option value="m2">Metros cuadrados (m²)</option>
                    <option value="mz">Manzanas (mz)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Latitud Referencial
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Longitud Referencial
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingFarm ? 'Actualizar Finca' : 'Crear Finca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diálogo Confirmar Eliminación */}
      <ConfirmDialog
        isOpen={!!farmToDelete}
        title="¿Eliminar esta finca?"
        message={`¿Estás seguro de que deseas eliminar "${farmToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Definitivamente"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setFarmToDelete(null)}
      />
    </div>
  );
}
