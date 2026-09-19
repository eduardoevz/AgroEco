# 🧩 UI Component Recipes (UX/UI Pro Max)

A curated collection of accessible, modern Tailwind CSS recipes for web & mobile interfaces.

---

## 1. Status Badges & Severity Chips

```tsx
// Severity: Low (Verde / Éxito)
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  Severidad Leve
</span>

// Severity: Moderate (Ámbar / Precaución)
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
  Severidad Moderada
</span>

// Severity: High / Severe (Rojo / Peligro)
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
  Alerta Crítica
</span>
```

---

## 2. Segmented Controls / Filter Tabs

```tsx
<div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-medium text-slate-600">
  <button className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm font-semibold transition-all">
    Todos (18)
  </button>
  <button className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 transition-colors">
    Activos (12)
  </button>
  <button className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 transition-colors">
    Tratados (6)
  </button>
</div>
```

---

## 3. Accessible Floating Input with Icon

```tsx
<div className="space-y-1.5">
  <label className="block text-xs font-semibold text-slate-700 tracking-wide">
    Nombre del Lote o Parcela
  </label>
  <div className="relative rounded-xl shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
      <Sprout className="w-4 h-4" />
    </div>
    <input
      type="text"
      placeholder="Ej: Lote San Jerónimo #4"
      className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
    />
  </div>
</div>
```

---

## 4. Responsive Card Grid with Hover Glow

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  <div className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
        <Leaf className="w-6 h-6" />
      </div>
      <span className="text-xs font-semibold text-slate-400">Hace 2 horas</span>
    </div>
    <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
      Diagnóstico en Plátano
    </h3>
    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
      Detección temprana de Sigatoka Negra con 94% de certeza fitosanitaria.
    </p>
  </div>
</div>
```
