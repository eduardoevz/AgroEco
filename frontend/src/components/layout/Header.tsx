'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ScanLine, User } from 'lucide-react';
import { isDemoMode } from '@/lib/firebase/config';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Brand Logo */}
      <div className="flex items-center gap-2.5 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-sm font-bold text-stone-900 tracking-tight block leading-none">
            AgroEco
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block">
            Monitoreo Fitosanitario
          </span>
        </div>
      </div>

      {/* Demo Mode Badge */}
      <div className="hidden sm:flex items-center gap-2">
        {isDemoMode && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Modo Demostración / Offline
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/analyze"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
        >
          <ScanLine className="w-4 h-4" />
          <span>Analizar Planta</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
          aria-label="Ir a perfil de usuario"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <span className="text-xs font-semibold text-stone-700 hidden lg:inline-block">
            {user?.name || 'Mi Perfil'}
          </span>
        </Link>
      </div>
    </header>
  );
};
