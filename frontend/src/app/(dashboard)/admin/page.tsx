'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCrops, getDiseases, seedMasterCatalogToFirestore } from '@/lib/firebase/firestore';
import { Crop, Disease } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { LoadingState } from '@/components/ui/LoadingState';
import { ShieldAlert, Sprout, BookOpen, CheckCircle2, ChevronRight, Check, Database, Loader2 } from 'lucide-react';

export default function AdminCatalogPage() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string>('platano');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const loadCatalog = async () => {
    try {
      const [c, d] = await Promise.all([getCrops(), getDiseases()]);
      setCrops(c);
      setDiseases(d);
      if (c.length > 0 && !selectedCropId) {
        setSelectedCropId(c[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleSeedFirestore = async () => {
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const res = await seedMasterCatalogToFirestore();
      setSeedSuccess(`¡Sincronizado! ${res.cropsCount} cultivos y ${res.diseasesCount} patologías guardadas en Cloud Firestore.`);
      await loadCatalog();
      setTimeout(() => setSeedSuccess(null), 5000);
    } catch (err: any) {
      alert('Error sincronizando con Firestore: ' + (err.message || err));
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    const first = diseases.find((d) => d.cropId === selectedCropId);
    setSelectedDisease(first || null);
  }, [selectedCropId, diseases]);

  if (loading) {
    return <LoadingState message="Cargando catálogo maestro fitosanitario..." />;
  }

  const currentCropDiseases = diseases.filter((d) => d.cropId === selectedCropId);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Catálogo Maestro de Cultivos y Patologías"
        subtitle="Administración de bases de conocimiento agronómico, sintomatología y recomendaciones"
        action={
          <button
            type="button"
            onClick={handleSeedFirestore}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>{seeding ? 'Guardando en Firestore...' : 'Sincronizar con Firestore'}</span>
          </button>
        }
      />

      {seedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{seedSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selector de Cultivos */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Cultivos Activos ({crops.length})</span>
          </h3>
          <div className="space-y-1.5">
            {crops.map((c) => {
              const count = diseases.filter((d) => d.cropId === c.id).length;
              const isSelected = selectedCropId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCropId(c.id)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium'
                  }`}
                >
                  <div>
                    <span className="text-xs block">{c.name}</span>
                    {c.scientificName && (
                      <span className="text-[10px] text-stone-400 italic block">
                        {c.scientificName}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Listado de Enfermedades por Cultivo */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Patologías del Cultivo ({currentCropDiseases.length})</span>
          </h3>
          <div className="space-y-1.5">
            {currentCropDiseases.map((d) => {
              const isSelected = selectedDisease?.id === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDisease(d)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/30 font-bold shadow-sm'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium'
                  }`}
                >
                  <div>
                    <span className="text-xs text-stone-900 block">{d.name}</span>
                    <span className="text-[10px] text-stone-400 italic block">
                      {d.scientificName}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle Agronómico de la Patología */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Ficha Técnica y Manejo</span>
          </h3>

          {selectedDisease ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700">
                  Tipo: {selectedDisease.type}
                </span>
                <h4 className="text-base font-bold text-stone-900 mt-0.5">
                  {selectedDisease.name}
                </h4>
                <p className="text-stone-500 italic text-[11px]">
                  {selectedDisease.scientificName}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  Descripción
                </span>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {selectedDisease.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  Síntomas Característicos
                </span>
                <ul className="space-y-1">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  Recomendaciones Agronómicas
                </span>
                <ul className="space-y-1.5">
                  {selectedDisease.recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-stone-700 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-400 bg-white rounded-3xl border border-stone-200">
              Selecciona una enfermedad para ver sus especificaciones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
