'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageTitle } from '@/components/layout/PageTitle';
import { formatDate } from '@/lib/utils/formatters';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  LogOut,
  CheckCircle2,
  Sparkles,
  Award,
  Cpu,
  Fingerprint,
  Save,
  Clock,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <PageTitle
        title="Perfil del Productor"
        subtitle="Credenciales agronómicas, parámetros de cuenta y seguridad de la plataforma"
      />

      {/* Tarjeta de Identidad Digital AgroEco */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-[#07130F] text-white p-6 sm:p-8 border border-emerald-950/40 shadow-xl shadow-slate-950/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-emerald-400 tracking-tight">
                  {user?.name?.charAt(0).toUpperCase() || 'P'}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white" title="Cuenta Verificada">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">{user?.name || 'Productor AgroEco'}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                  <Sparkles className="w-2.5 h-2.5" /> Plan Pro Agrícola
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-emerald-400" /> ID: {user?.id?.slice(0, 10)}...
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" /> Rol: <span className="text-white capitalize font-semibold">{user?.role || 'productor'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-4 sm:pt-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estado de Red IA</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.6 Activo
              </span>
            </div>
          </div>
        </div>

        {/* Mini telemetry strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Cifrado de Datos</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-emerald-400" /> TLS 1.3 / AES-256
            </span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Motor Predictivo</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
              <Cpu className="w-3 h-3 text-emerald-400" /> Híbrido Cloud / Edge
            </span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Antigüedad en Sistema</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-emerald-400" /> {user?.createdAt ? formatDate(user.createdAt) : '2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario de Parámetros */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Información Operativa del Titular</h3>
            <p className="text-xs text-slate-500 mt-0.5">Actualiza los datos de correspondencia fitosanitaria y despacho técnico</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span className="font-semibold">Perfil agronómico actualizado exitosamente en el servidor.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Nombre Completo / Razón Social Agrícola
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 transition-all"
                placeholder="Ej. Juan Pérez / Hacienda Los Rosales"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Teléfono de Contacto Técnico / Alertas de Cultivo
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 pl-1">
              Utilizado para recibir notificaciones sobre alertas epidemiológicas tempranas.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">
                Correo Electrónico Registrado
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Vinculado a Firebase Auth</span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-slate-500 font-mono font-medium cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Rol del Ecosistema
                </span>
                <span className="font-bold text-slate-800 capitalize text-xs">
                  {user?.role || 'Productor'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-800 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Fecha de Afiliación
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  {user?.createdAt ? formatDate(user.createdAt) : 'Ciclo 2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-2xl transition-all border border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión Activa</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando Cambios...' : 'Guardar Cambios del Perfil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
