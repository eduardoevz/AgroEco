'use client';

import React from 'react';
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
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900">
      {/* Header Landing */}
      <header className="px-6 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-stone-900 block leading-none">
                AgroEco
              </span>
              <span className="text-[11px] font-medium text-emerald-700 block">
                Salud Vegetal & Georreferenciación
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
              >
                Ir a Mi Panel
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6">
          <Sprout className="w-4 h-4" />
          <span>Agricultura de Precisión & Diagnóstico Asistido</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-950 max-w-3xl leading-[1.15]">
          Detección temprana y monitoreo georreferenciado de enfermedades en cultivos
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mt-5 leading-relaxed">
          Utiliza <strong>inteligencia artificial</strong> para identificar qué puede estar afectando tu cultivo, <strong>GPS</strong> para geolocalizar con exactitud el brote y <strong>datos históricos</strong> para dar seguimiento y proteger tu producción.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
          <Link
            href={user ? '/analyze' : '/login'}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98"
          >
            <ScanLine className="w-5 h-5" />
            <span>Comenzar Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={user ? '/dashboard' : '/register'}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-2xl transition-all"
          >
            Explorar Plataforma
          </Link>
        </div>

        {/* Pilares Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          {/* Pilar 1: IA */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Visión por Computadora
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Analiza fotografías de hojas, tallos y frutos desde el teléfono. Recibe una estimación preliminar asistida por IA con síntomas y recomendaciones.
            </p>
          </div>

          {/* Pilar 2: GPS */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Georreferenciación Satelital
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cada muestra queda anclada a las coordenadas GPS exactas en tu parcela. Visualiza brotes, focos y mapas de concentración en tiempo real.
            </p>
          </div>

          {/* Pilar 3: Seguimiento */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Seguimiento Evolutivo
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Registra avances de tratamiento (Detectado → En seguimiento → Tratado → Controlado) y mide la eficacia de las medidas aplicadas.
            </p>
          </div>
        </div>

        {/* Advertencia Legal */}
        <div className="mt-14 p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-500 max-w-xl">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-stone-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Herramienta de Asistencia Agronómica
          </p>
          <p>
            Los resultados corresponden a diagnósticos preliminares asistidos por inteligencia artificial y no sustituyen el criterio de un agrónomo profesional en campo.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-stone-200 bg-white text-center text-xs text-stone-400">
        <p>© 2026 AgroEco · Tecnología de salud vegetal para productores agrícolas.</p>
      </footer>
    </div>
  );
}
