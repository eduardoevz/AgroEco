'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ScanLine, Map, History } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Inicio', href: '/dashboard', icon: Home },
    { label: 'Analizar', href: '/analyze', icon: ScanLine, isPrimary: true },
    { label: 'Mapa', href: '/map', icon: Map },
    { label: 'Historial', href: '/history', icon: History },
  ];

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 pb-safe"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 group"
                aria-label="Iniciar análisis fitosanitario"
              >
                <div className="w-13 h-13 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 group-hover:bg-emerald-800 transition-transform active:scale-95 p-3.5">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-colors ${
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
