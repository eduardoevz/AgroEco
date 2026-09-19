'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageTitle } from '@/components/layout/PageTitle';
import { formatDate } from '@/lib/utils/formatters';
import { User, Mail, Phone, Shield, Calendar, LogOut, CheckCircle2 } from 'lucide-react';

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
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageTitle
        title="Mi Perfil Agrícola"
        subtitle="Información de cuenta y datos de contacto"
      />

      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
        {/* Avatar y encabezado de usuario */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-900/20">
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">{user?.name}</h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize mt-1">
              Rol: {user?.role || 'productor'}
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Perfil actualizado exitosamente.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Nombre Completo o Empresa
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Teléfono de Contacto
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Correo Electrónico (No editable)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-stone-400" />
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Rol del Sistema
                </span>
                <span className="font-semibold text-stone-700 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400" />
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Miembro Desde
                </span>
                <span className="font-semibold text-stone-700">
                  {user?.createdAt ? formatDate(user.createdAt) : '2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
