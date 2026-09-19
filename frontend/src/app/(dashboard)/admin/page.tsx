'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCrops, getDiseases, seedMasterCatalogToFirestore } from '@/lib/firebase/firestore';
import { Crop, Disease } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  ShieldAlert,
  Sprout,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  Loader2,
  Sparkles,
  Layers,
  FlaskConical,
  Microscope,
  Info,
  Check,
} from 'lucide-react';

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
      setSeedSuccess(`¡Sincronizado con éxito! ${res.cropsCount} cultivos y ${res.diseasesCount} patologías validadas en Cloud Firestore.`);
      await loadCatalog();
      setTimeout(() => setSeedSuccess(null), 6000);
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
  const activeCrop = crops.find((c) => c.id === selectedCropId);

  return (
    <div className="space-y-6 pb-12">
      <PageTitle
        title="Catálogo Maestro Fitosanitario"
        subtitle="Repositorio agronómico de patógenos, sintomatología clínica y protocolos de mitigación"
        action={
          <button
            type="button"
            onClick={handleSeedFirestore}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>{seeding ? 'Escribiendo en Firestore...' : 'Sincronizar Firestore'}</span>
          </button>
        }
      />

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Cultivos Activos</span>
            <span className="text-lg font-black text-slate-900">{crops.length} especies</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Patologías Indexadas</span>
            <span className="text-lg font-black text-slate-900">{diseases.length} afecciones</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Modelo Visión</span>
            <span className="text-lg font-black text-slate-900">Gemini 3.6 / MNet</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Estado Catálogo</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sincronizado
            </span>
          </div>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-semibold">{seedSuccess}</span>
        </div>
      )}

      {/* Main 3-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Selector de Cultivos (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Cultivos ({crops.length})</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Selecciona especie</span>
          </div>

          <div className="space-y-2">
            {crops.map((c) => {
              const count = diseases.filter((d) => d.cropId === c.id).length;
              const isSelected = selectedCropId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCropId(c.id)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'border-emerald-600 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-700 font-medium'
                  }`}
                >
                  <div className="pr-2">
                    <span className="text-xs font-bold block group-hover:text-slate-900 transition-colors">
                      {c.name}
                    </span>
                    {c.scientificName && (
                      <span className="text-[10px] text-slate-400 italic block font-mono mt-0.5">
                        {c.scientificName}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Col 2: Listado de Enfermedades (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Patologías ({currentCropDiseases.length})</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
              En {activeCrop?.name}
            </span>
          </div>

          <div className="space-y-2">
            {currentCropDiseases.map((d) => {
              const isSelected = selectedDisease?.id === d.id;
              const isHealthy = d.type?.toLowerCase().includes('sano') || d.name?.toLowerCase().includes('sano');

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDisease(d)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="pr-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                          isHealthy
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.type || 'Patógeno'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors">
                      {d.name}
                    </span>
                    <span className="text-[10px] text-slate-400 italic block font-mono">
                      {d.scientificName}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Col 3: Ficha Técnica Detallada (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Dossier Fitosanitario</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Ficha Técnica
            </span>
          </div>

          {selectedDisease ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5 text-xs">
              {/* Encabezado de la Ficha */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Tipo: {selectedDisease.type}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Cultivo: {activeCrop?.name}
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">
                  {selectedDisease.name}
                </h4>
                <p className="text-slate-500 italic text-xs font-serif mt-0.5">
                  {selectedDisease.scientificName}
                </p>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Descripción Etiológica
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  {selectedDisease.description}
                </p>
              </div>

              {/* Síntomas */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sintomatología y Cuadro Clínico
                </span>
                <ul className="space-y-1.5">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="font-medium text-[11px] leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recomendaciones */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Protocolos de Manejo y Recomendación Agronómica
                </span>
                <ul className="space-y-2">
                  {selectedDisease.recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-800 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-[11px] leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200/80">
              <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Selecciona una patología para consultar su ficha técnica agronómica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
