---
name: ux-ui-pro-max
description: >-
  Elite UX/UI design system, interaction design, and frontend aesthetics skill.
  Activate whenever the user requests designing, styling, building, evaluating,
  or modernizing user interfaces, component layouts, visual hierarchy, color systems,
  micro-interactions, mobile-first responsiveness, and accessibility in React, Next.js, and Tailwind CSS.
---

# 🎨 UX/UI Pro Max: Elite Design System & Frontend Experience Skill

This skill elevates user interfaces from functional to visually stunning, accessible, and delightful. It enforces high-end product design standards seen in top-tier apps (Linear, Stripe, Apple, Airbnb) while maintaining practical performance and responsiveness.

---

## 🏛️ Core Principles of "Pro Max" Design

1. **Hierarchy Before Decoration:**
   - Every screen must have a clear primary focal point (the "North Star" action).
   - Use scale, weight, and contrast—not just color—to direct user attention.
   - 60-30-10 rule: 60% neutral canvas, 30% structural surfaces/secondary, 10% intentional accent.

2. **Spatial Cadence (4px / 8px Grid):**
   - Strictly adhere to standard 4px multiples for spacing, margins, and padding (`p-1`, `p-2`, `p-4`, `p-6`, `p-8`, `p-12`).
   - Component internal padding (`p-4` or `p-6`) must be distinct from layout gaps (`gap-3` to `gap-8`).
   - Group related elements closely (Gestalt Law of Proximity).

3. **Depth, Glassmorphism & Elevation:**
   - Avoid harsh, pure black shadows. Use layered ambient shadows with subtle opacity:
     `shadow-sm`, `shadow-md shadow-emerald-950/5`, or modern border rings `ring-1 ring-black/5 dark:ring-white/10`.
   - Use backdrop blur (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-white/20`) for floating headers, drawers, and overlays.

4. **Typography & Optical Rhythm:**
   - Never use more than two typeface families (usually 1 clean geometric sans-serif like Inter, Plus Jakarta Sans, or Geist).
   - Line heights: tightly leading titles (`leading-tight` or `tracking-tight`), breathable body copy (`leading-relaxed`).
   - Muted secondary text must remain legible: use `text-slate-500` / `text-slate-400`, never dipping below WCAG AA contrast (minimum 4.5:1).

5. **Mobile-First & Touch Ergonomics:**
   - Interactive touch targets must be at least **44x44px** (preferably **48x48px** for primary actions).
   - Place critical navigation and primary triggers within the "thumb zone" (bottom sheets, sticky floating action bars).
   - Forms must prevent iOS auto-zoom by using at least `text-base` (16px) on inputs.

---

## 💎 Design System Tokens (AgroEco & Modern Tech Palette)

### 🌿 Color Harmony
- **Primary / Action (Emerald/Forest):**
  - Brand: `emerald-600` (`#059669`) / Hover: `emerald-700` (`#047857`) / Soft glow: `emerald-500/15`
- **Secondary / Agronomic Accent (Amber / Harvest):**
  - Accent: `amber-500` (`#f59e0b`) / Badges: `amber-50` with `text-amber-800 border-amber-200`
- **System States:**
  - Success / Healthy: `emerald-600` / `emerald-50`
  - Warning / Moderate Severity: `amber-500` / `amber-50`
  - Critical / Severe Alert: `rose-600` / `rose-50`
  - Informational / Sync: `sky-600` / `sky-50`
- **Neutrals / Surfaces:**
  - Light mode background: `bg-slate-50` or `bg-[#f8fafc]`
  - Light mode cards: `bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow`
  - Dark mode surfaces: `bg-slate-900` with borders in `slate-800` and cards in `slate-900/60`

---

## ⚡ Interactive Component Guidelines

### 1. Buttons & Call-to-Actions (CTAs)
- **Primary:**
  ```tsx
  <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-emerald-600/25 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
    <span>Acción Principal</span>
    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
  </button>
  ```
- **Secondary / Ghost:**
  ```tsx
  <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100/80 border border-slate-200 active:scale-[0.98] transition-all">
    Cancelar
  </button>
  ```

### 2. Metric & Stat Cards (Bento-Grid Style)
- Group metrics with an icon badge, micro-trend indicator, clear label, and bold value:
  ```tsx
  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Salud del Lote</span>
      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
        <Sprout className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold tracking-tight text-slate-900">94.2%</span>
      <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        +2.4% este mes
      </span>
    </div>
  </div>
  ```

### 3. Modals & Bottom Sheets
- **Mobile First:** On small viewports (`<sm`), modals should slide up from the bottom as a **drawer / bottom sheet** with a drag handle.
- **Desktop:** Centered with a soft backdrop blur (`bg-slate-900/40 backdrop-blur-sm`).
- Always support closing via `Esc` key, outside backdrop click, and explicit close button.

### 4. Empty States & Skeleton Loaders
- **Never leave users looking at a blank space:**
  - Provide an illustrated or styled icon (e.g. `FolderPlus` inside a soft circle).
  - A friendly explanation ("No tienes diagnósticos registrados aún").
  - A high-contrast direct action button ("Registrar mi primer cultivo").
- **Loading:**
  - Replace generic spinners with layout-accurate **shimmer skeletons** (`animate-pulse bg-slate-200 rounded-lg`).

---

## 📱 Mobile PWA & Responsive Patterns

1. **Bottom Navigation Bar:**
   - On screens `<md`, provide a fixed bottom bar with 4-5 core destinations, haptic visual feedback, and active pill indicators.
2. **Pull-to-Refresh & Feedback:**
   - Provide instant visual reassurance on actions (toast banners, optimistic UI updates, checkmark animations).
3. **Camera & Image Upload:**
   - Provide large drag-and-drop targets with instant thumbnail previews, crop/re-take controls, and progress indicators during upload.

---

## 🚫 Critical Anti-Patterns to Avoid

- ❌ Never use raw `alert()` or `confirm()`—always use styled modals or sonner/toast notifications.
- ❌ Avoid pure black `#000000` text on pure white `#ffffff`; use `text-slate-900` or `text-zinc-900`.
- ❌ Never hide labels completely in favor of placeholders (placeholders vanish on input).
- ❌ Never disable zoom or trap keyboard focus.
- ❌ Avoid tiny touch buttons (`h-6 w-6`) on mobile devices.
- ❌ Never display unformatted raw database IDs (`#64fbc789e0`) to end users.
