'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ScanLine, Map, History, BookOpen } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Inicio', href: '/dashboard', icon: Home },
    { label: 'Catálogo', href: '/catalog', icon: BookOpen },
    { label: 'Analizar', href: '/analyze', icon: ScanLine, isPrimary: true },
    { label: 'Mapa', href: '/map', icon: Map },
    { label: 'Historial', href: '/history', icon: History },
  ];

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2 pb-safe shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group focus:outline-none"
                aria-label="Iniciar análisis fitosanitario"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 group-hover:shadow-emerald-500/50 transition-all duration-200 active:scale-90 p-3.5 ring-4 ring-white">
                  <Icon className="w-7 h-7 transition-transform group-hover:rotate-6" />
                </div>
                <span className="text-[11px] font-extrabold text-emerald-800 mt-1 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-all rounded-xl ${
                isActive
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-emerald-50' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
