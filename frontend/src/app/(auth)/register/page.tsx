'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getFriendlyErrorMessage = (err: any) => {
    const code = err?.code || '';
    const msg = err?.message || '';

    if (code === 'auth/email-already-in-use') {
      return 'Este correo electrónico ya está registrado. Inicia sesión directamente.';
    }
    if (code === 'auth/weak-password') {
      return 'La contraseña es muy débil. Debe tener al menos 6 caracteres y combinar letras y números.';
    }
    if (code === 'auth/invalid-email') {
      return 'El formato del correo electrónico no es válido.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'El registro por Email/Contraseña o Google no está habilitado en Firebase. Actívalo en la consola de Firebase -> Authentication.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'La ventana de Google se cerró antes de completar el registro.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'Dominio no autorizado en Firebase. Agrega "localhost" en Firebase Console -> Authentication -> Settings -> Authorized domains.';
    }
    return msg || 'Error al registrar la cuenta. Inténtalo de nuevo.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await register(email, password, name, 'productor');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error al registrarse:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleSubmitting(true);
    setErrorMessage(null);

    try {
      await loginGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error Google Sign-Up:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm max-w-md w-full">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Crear Cuenta
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Únete a la red de monitoreo fitosanitario y protege tus cultivos
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Botón Registrarse con Google */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
          <span>{googleSubmitting ? 'Conectando con Google...' : 'Registrarse con Google'}</span>
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
              Nombre Completo o Empresa Agrícola
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="productor@finca.com"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || googleSubmitting}
            className="w-full py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Registrando...' : 'Crear Cuenta'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="font-bold text-emerald-700 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
