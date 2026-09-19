'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, LogIn, AlertCircle } from 'lucide-react';
import { isDemoMode } from '@/lib/firebase/config';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginGoogle } = useAuth();

  const [email, setEmail] = useState(isDemoMode ? 'carlos.mendoza@agrodemo.com' : '');
  const [password, setPassword] = useState(isDemoMode ? '123456' : '');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getFriendlyErrorMessage = (err: any) => {
    const code = err?.code || '';
    const msg = err?.message || '';

    if (code === 'auth/popup-closed-by-user') {
      return 'La ventana de Google se cerró antes de completar el inicio de sesión.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'Dominio no autorizado en Firebase. Asegúrate de que "localhost" esté en Firebase Console -> Authentication -> Settings -> Authorized domains.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Este método de acceso no está habilitado en tu consola de Firebase. Activa "Email/Password" o "Google" en Authentication -> Sign-in method.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Credenciales incorrectas. Verifica tu correo y contraseña o regístrate si no tienes cuenta.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Fallo de conexión con Firebase. Revisa tu conexión a internet o bloqueadores de anuncios.';
    }
    return msg || 'Error al iniciar sesión. Por favor verifica tus credenciales.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error de login:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setErrorMessage(null);

    try {
      await loginGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error Google Sign-In:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm max-w-md w-full">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Accede a tu plataforma de monitoreo fitosanitario
          </p>
          {isDemoMode && (
            <div className="mt-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
              Modo Demostración Activo · Acceso Inmediato
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Botón Iniciar con Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleSubmitting || submitting}
          className="w-full py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleSubmitting ? 'Conectando con Google...' : 'Continuar con Google'}</span>
        </button>

        {/* Separador */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-stone-400 font-semibold">o con tu correo</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-emerald-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || googleSubmitting}
            className="w-full py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Iniciando...' : 'Entrar'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="font-bold text-emerald-700 hover:underline"
          >
            Regístrate como productor
          </Link>
        </div>
      </div>
    </div>
  );
}
