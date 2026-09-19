'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ScanLine,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sprout,
  CheckCircle2,
  Layers,
  Cpu,
  Activity,
  Globe2,
  ChevronRight,
  Leaf,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeCropTab, setActiveCropTab] = useState<'cafe' | 'platano' | 'tomate'>('cafe');

  const demoScans = {
    cafe: {
      crop: 'Café (Coffea arabica)',
      disease: 'Roya del Café',
      pathogen: 'Hemileia vastatrix',
      confidence: 96.4,
      severity: 'Moderada',
      severityColor: 'bg-amber-50 text-amber-700 border-amber-200/80',
      organ: 'Hoja',
      coordinates: '4.5389° N, -75.6757° W',
      location: 'Finca La Esperanza · Lote Café Castillo',
      observation: 'Presencia de pústulas pulverulentas color naranja intenso en el envés foliar con halo clorótico incipiente.',
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    },
    platano: {
      crop: 'Plátano (Musa paradisiaca)',
      disease: 'Sigatoka Negra',
      pathogen: 'Pseudocercospora fijiensis',
      confidence: 94.8,
      severity: 'Crítica / Alta',
      severityColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
      organ: 'Lámina foliar',
      coordinates: '7.8821° N, -76.6258° W',
      location: 'Hacienda El Palmar · Parcela Banano Williams',
      observation: 'Estrías elípticas de color pardo rojizo con centro necrótico y desecación prematura de bordes foliares.',
      img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800&auto=format&fit=crop',
    },
    tomate: {
      crop: 'Tomate (Solanum lycopersicum)',
      disease: 'Tizón Tardío',
      pathogen: 'Phytophthora infestans',
      confidence: 97.1,
      severity: 'Severa',
      severityColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
      organ: 'Follaje y fruto',
      coordinates: '5.0689° N, -75.5174° W',
      location: 'Invernadero San Mateo · Lote Chonto',
      observation: 'Lesiones acuosas irregulares de color verde oscuro a pardo con vellosidad blanquecina en condiciones húmedas.',
      img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=800&auto=format&fit=crop',
    },
  };

  const currentScan = demoScans[activeCropTab];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-amber-100/30 blur-3xl pointer-events-none -z-10" />

      {/* Header Landing */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-none">
                  AgroEco
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI VISION
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 block mt-0.5">
                Salud Vegetal & Georreferenciación
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-all"
            >
              <span>Catálogo Agrícola (6 Cultivos)</span>
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-sm shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ir al Panel de Control</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Crear Cuenta Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center relative">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-6 shadow-xs animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>Visión Multimodal Gemini 3.6 + MobileNetV3 • 96.4% Precisión</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 max-w-4xl leading-[1.08]">
          Detección temprana y control georreferenciado de{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
            patologías vegetales
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mt-6 leading-relaxed font-normal">
          Protege tus cosechas con diagnóstico fitosanitario asistido por <strong>Inteligencia Artificial de última generación</strong>, trazabilidad satelital GPS en parcela y registro histórico de tratamientos contra plagas y hongos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-9 w-full sm:w-auto">
          <Link
            href={user ? '/analyze' : '/login'}
            className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            <ScanLine className="w-5 h-5" />
            <span>Diagnosticar Cultivo en Vivo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={user ? '/dashboard' : '/login'}
            className="w-full sm:w-auto px-7 py-4 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl transition-all shadow-sm hover:shadow hover:border-slate-300"
          >
            Probar Demo Inmediata (1-Clic)
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-14 pt-8 border-t border-slate-200/80 w-full max-w-4xl">
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">6</span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Cultivos Oficiales</span>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight block">20</span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Patologías Catalogadas</span>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">96.4%</span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Precisión Diagnóstica</span>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight block">&lt; 1.5s</span>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Velocidad de Inferencia</span>
          </div>
        </div>

        {/* Interactive Live Scanner Preview Widget */}
        <div className="mt-14 w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-emerald-950/10 p-6 md:p-8 text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Simulación Interactiva en Tiempo Real
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
                Inspección Asistida por IA Multimodal
              </h3>
            </div>

            {/* Crop Selector Tabs */}
            <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveCropTab('cafe')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCropTab === 'cafe' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ☕ Café
              </button>
              <button
                type="button"
                onClick={() => setActiveCropTab('platano')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCropTab === 'platano' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍌 Plátano
              </button>
              <button
                type="button"
                onClick={() => setActiveCropTab('tomate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCropTab === 'tomate' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍅 Tomate
              </button>
            </div>
          </div>

          {/* Card Body with Photo + Live Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200 shadow-inner group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentScan.img}
                alt={currentScan.disease}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/20">
                <ScanLine className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Escaneo Completo</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-semibold text-emerald-300 block">{currentScan.crop}</span>
                <span className="text-xs text-slate-300">Órgano evaluado: {currentScan.organ}</span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {currentScan.disease}
                  </h4>
                  <p className="text-xs text-slate-500 italic font-medium mt-0.5">
                    {currentScan.pathogen}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${currentScan.severityColor}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  Severidad {currentScan.severity}
                </span>
              </div>

              {/* Confidence Progress Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Certeza Fitosanitaria del Algoritmo</span>
                  <span className="text-emerald-700 font-extrabold">{currentScan.confidence}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${currentScan.confidence}%` }}
                  />
                </div>
              </div>

              {/* Botanical Note */}
              <div className="text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl leading-relaxed">
                <strong className="text-emerald-900 font-bold block mb-0.5">Diagnóstico Botánico AI:</strong>
                {currentScan.observation}
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">{currentScan.location}</span>
                <span className="font-mono text-[10px] text-slate-400">({currentScan.coordinates})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
              Visión Multimodal Resiliente
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Arquitectura de 3 capas: Google Gemini 3.6 Flash como motor analítico principal con justificación botánica, y failover automático a Red Neuronal convolucional MobileNetV3 sin cortes de servicio.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors">
              Georreferenciación Satelital GPS
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Cada muestreo fitosanitario almacena latitud, longitud y precisión milimétrica, generando capas de calor epidemiológicas y alertas de focos de dispersión en el mapa interactivo.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
              Trazabilidad & Auditoría BPA
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Línea de tiempo evolutiva por cada caso: Detectado → En seguimiento → Tratado → Controlado. Exporta reportes clínicos certificados para auditorías fitosanitarias y exportación.
            </p>
          </div>
        </div>

        {/* High Conversion Bottom CTA */}
        <div className="mt-16 w-full rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Moderniza la sanidad vegetal de tus cultivos hoy mismo
            </h2>
            <p className="text-emerald-200/90 text-sm leading-relaxed">
              Únete a cientos de productores agrícolas y cooperativas que ya toman decisiones basadas en datos e inteligencia artificial.
            </p>
            <div className="pt-3">
              <Link
                href={user ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-emerald-950 bg-white hover:bg-emerald-50 active:scale-98 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Comenzar con AgroEco</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-10 p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 max-w-2xl text-center">
          <p className="flex items-center justify-center gap-1.5 font-bold text-slate-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Aviso de Responsabilidad Agronómica
          </p>
          <p className="leading-relaxed">
            Los resultados corresponden a análisis preliminares asistidos por inteligencia artificial y visión por computadora. No sustituyen el examen fitopatológico presencial ni la receta técnica de un ingeniero agrónomo certificado.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>© 2026 AgroEco Platform · Tecnología para la productividad y sanidad del campo agrícola.</p>
      </footer>
    </div>
  );
}
