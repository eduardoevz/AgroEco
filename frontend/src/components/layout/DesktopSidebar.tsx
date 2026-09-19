'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ScanLine,
  MapPin,
  History,
  Trees,
  Layers,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analizar Planta', href: '/analyze', icon: ScanLine, highlight: true },
    { name: 'Mapa de Brotes', href: '/map', icon: MapPin },
    { name: 'Mis Fincas', href: '/farms', icon: Trees },
    { name: 'Historial', href: '/history', icon: History },
  ];

  const adminNav = [
    { name: 'Gestión Catálogo', href: '/admin', icon: ShieldAlert },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B131B] text-slate-200 border-r border-slate-800/80 min-h-screen relative z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/60 bg-gradient-to-b from-emerald-950/20 to-transparent">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
              AgroEco
            </h1>
            <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium mt-1">
            Monitoreo Fitosanitario
          </p>
        </div>
      </div>

      {/* Live System Pill */}
      <div className="mx-4 mt-4 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[10px] font-medium text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300">Motor IA Visión</span>
        </span>
        <span className="text-emerald-400 font-semibold">Activo</span>
      </div>

      {/* Main Nav */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Operaciones de Campo
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 shadow-md shadow-emerald-950/60 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 my-2.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="w-5 h-5 transition-transform group-hover:rotate-6" />
                <span className="flex-1 tracking-wide">{item.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-0.5'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              )}
            </Link>
          );
        })}

        {user?.role === 'administrador' && (
          <div className="pt-5 mt-2 border-t border-slate-800/60">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Supervisión Institucional
            </p>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:translate-x-0.5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/80 transition-all mb-1.5 group border border-transparent hover:border-slate-800"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 border border-emerald-600/40 flex items-center justify-center text-emerald-200 font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
              {user?.name || 'Productor Agrícola'}
            </p>
            <p className="text-[10px] text-slate-400 truncate capitalize">
              {user?.role || 'productor'} · Ver perfil
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
