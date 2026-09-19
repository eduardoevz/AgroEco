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
    <aside className="hidden md:flex flex-col w-64 bg-stone-900 text-stone-200 border-r border-stone-800 min-h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-stone-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/50">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-none">
            AgroEco
          </h1>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            Monitoreo Fitosanitario IA
          </p>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
          Operaciones
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950 transition-colors my-2"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-stone-800 text-emerald-400 font-semibold'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 text-stone-400" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {user?.role === 'administrador' && (
          <div className="pt-6">
            <p className="px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Administración
            </p>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-emerald-400 font-semibold'
                      : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 text-stone-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-stone-800 bg-stone-950/40">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-800/60 transition-colors mb-2"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-700 flex items-center justify-center text-emerald-300 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Productor Agrícola'}
            </p>
            <p className="text-[11px] text-stone-400 truncate">
              {user?.email || 'Sin sesión'}
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-stone-400 hover:text-red-400 hover:bg-stone-800/60 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
