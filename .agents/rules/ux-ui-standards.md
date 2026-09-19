# 🎨 Reglas y Estándares UX/UI Pro Max

Cuando diseñes, crees o edites componentes visuales o páginas en el frontend (`frontend/src/`):

1. **Jerarquía Visual y Tipografía:**
   - Usa un contraste claro (`text-slate-900` para títulos, `text-slate-500` para descripciones secundarias).
   - Respeta la escala espacial de múltiplos de 4px (`p-4`, `p-6`, `gap-4`, `gap-6`).
   - Evita colores negros puros (`#000000`); utiliza la paleta semántica `slate` o `zinc`.

2. **Componentes y Estados:**
   - Todo botón debe tener estados interactivos claros: `hover`, `active:scale-[0.98]`, `focus-visible:ring-2` y `disabled:opacity-50`.
   - Las tarjetas deben tener bordes sutiles (`border border-slate-200/80`), esquinas redondeadas generosas (`rounded-2xl`) y sombras ambientales suaves (`shadow-sm hover:shadow-md`).
   - Nunca muestres una pantalla vacía o en blanco: proporciona siempre un estado vacío (*empty state*) con icono, mensaje explicativo y botón de acción directa.

3. **Ergonomía Móvil (Mobile-First):**
   - Los elementos clickeables o táctiles deben tener al menos 44px a 48px de alto/ancho en móviles.
   - Toda tabla con muchas columnas debe adaptarse en tarjetas responsivas en pantallas pequeñas (`<md`).
   - Formularios accesibles: los inputs deben tener al menos `text-base` (16px) en pantallas móviles para evitar el zoom automático no deseado en iOS.
