'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageTitle } from '@/components/layout/PageTitle';
import { CROPS_CATALOG, CropAgronomicDetail } from '@/data/cropsCatalog';
import { INITIAL_DISEASES } from '@/demo/mockData';
import { Disease } from '@/types';
import {
  Sprout,
  ScanLine,
  Search,
  BookOpen,
  Thermometer,
  CloudRain,
  Mountain,
  Layers,
  Calendar,
  TrendingUp,
  Droplet,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Info,
  X,
  Microscope,
  Leaf,
  FlaskConical,
  Award,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export default function CatalogPage() {
  const [selectedCropId, setSelectedCropId] = useState<string>('platano');
  const [activeTab, setActiveTab] = useState<'botany' | 'management' | 'diseases' | 'biosecurity'>('diseases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [inspectingDisease, setInspectingDisease] = useState<Disease | null>(null);

  const categories = ['Todos', 'Musáceas', 'Estimulantes y Perennes', 'Hortalizas', 'Cereales', 'Leguminosas'];

  // Filter crops based on search & category
  const filteredCrops = useMemo(() => {
    return CROPS_CATALOG.filter((crop) => {
      const matchesCategory = selectedCategory === 'Todos' || crop.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesName = crop.name.toLowerCase().includes(q) || crop.scientificName.toLowerCase().includes(q);
      const matchesCategoryText = crop.category.toLowerCase().includes(q);
      
      // Also search within diseases of this crop
      const cropDiseases = INITIAL_DISEASES.filter((d) => crop.diseaseIds.includes(d.id));
      const matchesDisease = cropDiseases.some(
        (d) => d.name.toLowerCase().includes(q) || d.scientificName.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
      );

      return matchesCategory && (matchesName || matchesCategoryText || matchesDisease);
    });
  }, [searchQuery, selectedCategory]);

  const selectedCrop = useMemo(() => {
    return CROPS_CATALOG.find((c) => c.id === selectedCropId) || CROPS_CATALOG[0];
  }, [selectedCropId]);

  // Diseases for currently selected crop
  const cropDiseases = useMemo(() => {
    return INITIAL_DISEASES.filter((d) => selectedCrop.diseaseIds.includes(d.id));
  }, [selectedCrop]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <PageTitle
        title="Catálogo Agronómico Maestro"
        subtitle="Atlas fitosanitario y base de conocimiento técnico de los 6 cultivos estratégicos y sus 20 patologías monitoreadas por IA"
        action={
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="/AgroEco_Dossier_Comercial.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/50 border border-slate-200/80 rounded-2xl transition-all shadow-xs"
              title="Descargar dossier técnico y comercial en formato PDF"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Dossier PDF</span>
            </a>
            <Link
              href={`/analyze?crop=${selectedCrop.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ScanLine className="w-4 h-4" />
              <span>Diagnosticar {selectedCrop.name}</span>
            </Link>
          </div>
        }
      />

      {/* Control Bar: Search & Category Filter */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cultivo, patógeno (ej. Sigatoka, Roya, Tizón), nombre científico o síntoma..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-700">6 Cultivos Prioritarios</span>
            <span className="text-slate-300">•</span>
            <span>20 Patologías IA</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6-Crop Interactive Cards Carousel / Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Selecciona un Cultivo para Consultar Ficha Técnica</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            Mostrando {filteredCrops.length} de 6
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrop.id === crop.id;
            const diseaseCount = crop.diseaseIds.length;

            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => {
                  setSelectedCropId(crop.id);
                }}
                className={`group relative text-left rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-white shadow-lg shadow-emerald-950/10 -translate-y-1'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Image Cover */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={crop.heroImage}
                    alt={crop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Active Pin */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-950/40">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900">
                    {crop.category}
                  </span>

                  <div className="absolute bottom-2 left-3 right-3">
                    <h4 className="text-base font-black text-white tracking-tight leading-tight">
                      {crop.name}
                    </h4>
                    <p className="text-[10px] text-emerald-300 italic font-mono truncate">
                      {crop.scientificName}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Patologías IA:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full">
                        {diseaseCount} enfermedades
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Altitud:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[100px]">
                        {crop.climateAndSoil.altitude}
                      </span>
                    </div>
                  </div>

                  <div className={`pt-2 border-t text-[10px] font-bold flex items-center justify-between ${
                    isSelected ? 'text-emerald-700 border-emerald-100' : 'text-slate-400 border-slate-100 group-hover:text-slate-700'
                  }`}>
                    <span>{isSelected ? 'Ficha Activa' : 'Ver Ficha'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Master Dossier */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden transition-all">
        {/* Banner Hero */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-[#0A1A14] text-white p-6 md:p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedCrop.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 backdrop-blur-md">
                  Familia: {selectedCrop.family}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedCrop.badge}
                </span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {selectedCrop.name}
                </h2>
                <p className="text-sm md:text-base text-emerald-400 font-serif italic mt-0.5">
                  {selectedCrop.scientificName}
                </p>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                {selectedCrop.summary}
              </p>
            </div>

            <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md text-left lg:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Patologías en Base IA</span>
                <span className="text-2xl font-black text-emerald-400">{cropDiseases.length} Enfermedades</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Red Neuronal & Gemini 3.6</span>
              </div>

              <Link
                href={`/analyze?crop=${selectedCrop.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-2xl transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ScanLine className="w-4 h-4" />
                <span>Analizar Muestra de {selectedCrop.name}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200/80 bg-slate-50/70 px-4 md:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('diseases')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'diseases'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Atlas de Patologías IA ({cropDiseases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('botany')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'botany'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Botánica y Requisitos Edafaclimáticos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('management')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'management'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Ciclo Productivo y Manejo de Campo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biosecurity')}
            className={`py-4 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'biosecurity'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Bioseguridad y Alertas Fitosanitarias</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {/* TAB 1: PATOLOGÍAS */}
          {activeTab === 'diseases' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-emerald-600" />
                    <span>Patologías Monitoreadas en {selectedCrop.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enfermedades registradas en la red neuronal de AgroEco con diagnóstico automatizado
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  {cropDiseases.length} patologías detectables
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cropDiseases.map((disease) => {
                  const isHealthy = disease.name.toLowerCase().includes('sano');
                  const imageSrc = `/images/diseases/${disease.id}.jpg`;

                  return (
                    <div
                      key={disease.id}
                      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Real Dataset Image Preview */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={disease.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback to crop hero if disease image fails
                            (e.target as HTMLImageElement).src = selectedCrop.heroImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
                              isHealthy
                                ? 'bg-emerald-500/90 text-white'
                                : disease.type === 'bacterial'
                                ? 'bg-amber-500/90 text-white'
                                : disease.type === 'viral'
                                ? 'bg-purple-500/90 text-white'
                                : 'bg-rose-500/90 text-white'
                            }`}
                          >
                            {disease.type === 'fungal'
                              ? 'Hongo Fitosanitario'
                              : disease.type === 'bacterial'
                              ? 'Bacteria Vascular'
                              : disease.type === 'viral'
                              ? 'Virus Fitopatógeno'
                              : 'Tejido Sano'}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="text-base font-black text-white tracking-tight leading-snug">
                            {disease.name}
                          </h4>
                          <p className="text-[11px] text-emerald-300 italic font-mono truncate">
                            {disease.scientificName}
                          </p>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Affected Parts */}
                          {disease.affectedParts && disease.affectedParts.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Órganos:</span>
                              {disease.affectedParts.map((part) => (
                                <span
                                  key={part}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize"
                                >
                                  {part === 'leaf' ? 'Hoja' : part === 'stem' ? 'Tallo' : part === 'fruit' ? 'Fruto' : part === 'root' ? 'Raíz' : part}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {disease.description}
                          </p>

                          {/* Top Symptoms */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Signos Característicos:
                            </span>
                            <ul className="space-y-1">
                              {disease.symptoms.slice(0, 2).map((s, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                  <span className="line-clamp-2">{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectingDisease(disease)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                          >
                            <span>Ver Ficha Clínica</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/analyze?crop=${selectedCrop.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-emerald-700 rounded-xl transition-all"
                          >
                            <ScanLine className="w-3 h-3" />
                            <span>Escanear</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BOTÁNICA Y CLIMA */}
          {activeTab === 'botany' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span>Requerimientos Edafaclimáticos y Morfología Botánica</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parámetros fisiológicos para optimizar la resistencia natural del cultivo frente a estrés biótico
                </p>
              </div>

              {/* Climate & Soil Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Mountain className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Piso Térmico y Altitud</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{selectedCrop.climateAndSoil.altitude}</p>
                  <p className="text-[11px] text-slate-500">Franja altitudinal de adaptación óptima comercial.</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Thermometer className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Temperatura Óptima</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{selectedCrop.climateAndSoil.temperature}</p>
                  <p className="text-[11px] text-slate-500">Rango térmico para maximizar fotosíntesis sin fotoinhibición.</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Régimen Pluviométrico</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{selectedCrop.climateAndSoil.rainfall}</p>
                  <p className="text-[11px] text-slate-500">Lámina de agua anual requerida por el balance de evapotranspiración.</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-600">
                    <Droplet className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Humedad Relativa</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{selectedCrop.climateAndSoil.humidity}</p>
                  <p className="text-[11px] text-slate-500">Valores mayores pueden disparar la germinación de esporas fúngicas.</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Layers className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Requisito Edáfico / Suelo</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{selectedCrop.climateAndSoil.soilType}</p>
                  <p className="text-[11px] font-mono text-emerald-700 font-bold mt-1">pH Óptimo: {selectedCrop.climateAndSoil.soilPh}</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Heliofanía y Luz</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{selectedCrop.climateAndSoil.sunlight}</p>
                  <p className="text-[11px] text-slate-500">Fotoperiodo y horas de radiación activa requerida.</p>
                </div>
              </div>

              {/* Botany Structural Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Morfología y Órganos Funcionales</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Centro de Origen:</span>
                    <p className="font-semibold text-slate-800">{selectedCrop.botany.origin}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Hábito de Crecimiento:</span>
                    <p className="font-semibold text-slate-800">{selectedCrop.botany.growthHabit}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Arquitectura Radicular:</span>
                    <p className="font-semibold text-slate-800">{selectedCrop.botany.rootSystem}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Órgano de Aprovechamiento:</span>
                    <p className="font-semibold text-slate-800">{selectedCrop.botany.ediblePart}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANEJO AGRONÓMICO */}
          {activeTab === 'management' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Ciclo Fenológico, Rendimientos y Prácticas Culturales</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estrategias agronómicas de precisión para maximizar la cosecha y prevenir daños económicos
                </p>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Ciclo Vegetativo</span>
                  <p className="text-sm font-black text-emerald-950">{selectedCrop.cropCycle.cycleLength}</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Densidad de Población</span>
                  <p className="text-sm font-black text-slate-900">{selectedCrop.cropCycle.plantingDensity}</p>
                </div>

                <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">Rendimiento Promedio</span>
                  <p className="text-sm font-black text-blue-950">{selectedCrop.cropCycle.averageYield}</p>
                </div>

                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Ventana de Cosecha</span>
                  <p className="text-sm font-black text-amber-950">{selectedCrop.cropCycle.harvestWindow}</p>
                </div>
              </div>

              {/* Key Agronomic Practices */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Directrices Operativas de Campo
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Droplet className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wider text-[11px]">Estrategia de Riego</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{selectedCrop.agronomicPractices.irrigation}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <FlaskConical className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wider text-[11px]">Nutrición y Fertilización</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{selectedCrop.agronomicPractices.nutrition}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Layers className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wider text-[11px]">Labores y Podas Sanitarias</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{selectedCrop.agronomicPractices.management}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BIOSEGURIDAD */}
          {activeTab === 'biosecurity' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Protocolos de Bioseguridad y Alertas Epidemiológicas</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Normativas fitosanitarias de contingencia para preservar la inocuidad y evitar cuarentenas internacionales
                </p>
              </div>

              {/* Quarantine Banner */}
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 md:p-6 text-rose-950 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-700">
                    Alerta Cuarentenaria de Alta Prioridad
                  </span>
                </div>
                <p className="text-xs md:text-sm font-bold leading-relaxed">
                  {selectedCrop.biosecurityAndAlerts.quarantineAlert}
                </p>
              </div>

              {/* Climate Risk Trigger */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                    Disparadores Climáticos Críticos
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {selectedCrop.biosecurityAndAlerts.keyRisks}
                </p>
              </div>

              {/* Good Agricultural Practices (GAP) Checklist */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Buenas Prácticas Agrícolas Obligatorias (BPA)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {selectedCrop.biosecurityAndAlerts.goodPractices.map((practice, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">{practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deep Disease Dossier Modal */}
      {inspectingDisease && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              <img
                src={`/images/diseases/${inspectingDisease.id}.jpg`}
                alt={inspectingDisease.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = selectedCrop.heroImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                type="button"
                onClick={() => setInspectingDisease(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white">
                  {inspectingDisease.type}
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">
                  {inspectingDisease.name}
                </h3>
                <p className="text-xs text-emerald-300 italic font-mono">
                  {inspectingDisease.scientificName}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-5 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Descripción Etiológica
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {inspectingDisease.description}
                </p>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cuadro Clínico y Sintomatología Visible
                </span>
                <ul className="space-y-1.5">
                  {inspectingDisease.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Protocolos de Manejo Integrado y Mitigación
                </span>
                <ul className="space-y-2">
                  {inspectingDisease.recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setInspectingDisease(null)}
                  className="px-4 py-2.5 font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cerrar Ficha
                </button>

                <Link
                  href={`/analyze?crop=${selectedCrop.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Escanear Muestra con IA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
