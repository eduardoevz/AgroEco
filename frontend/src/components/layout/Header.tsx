'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ScanLine, User } from 'lucide-react';
import { isDemoMode } from '@/lib/firebase/config';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between transition-colors">
      {/* Mobile Brand Logo */}
      <div className="flex items-center gap-2.5 md:hidden">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-900/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-sm font-extrabold text-slate-900 tracking-tight block leading-none">
            AgroEco
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Salud Vegetal IA
          </span>
        </div>
      </div>

      {/* Connectivity & Operational Status Badges */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>GPS & Visión IA Activos</span>
        </div>

        {isDemoMode && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Modo Demo · Offline Ready
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/analyze"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <ScanLine className="w-4 h-4" />
          <span>Analizar Planta</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all group"
          aria-label="Ir a perfil de usuario"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
            {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold text-slate-700 hidden lg:inline-block group-hover:text-emerald-700 transition-colors">
            {user?.name || 'Mi Perfil'}
          </span>
        </Link>
      </div>
    </header>
  );
};
