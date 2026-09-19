'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Header } from './Header';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';

interface AppShellProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password'];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || '/');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingState message="Conectando con plataforma AgroEco..." />
      </div>
    );
  }

  // Rutas públicas (Landing, Login, Registro) no tienen barra lateral ni barra inferior
  if (isPublicRoute) {
    return <main className="min-h-screen bg-stone-50">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900">
      {/* Sidebar escritorio */}
      <DesktopSidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Navegación móvil fija inferior */}
      <MobileBottomNav />
    </div>
  );
};
