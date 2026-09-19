# Arquitectura Técnica - Sistema Agraria

## 1. Visión y Propuesta de Valor

> *"Utilizar inteligencia artificial para identificar qué puede estar afectando un cultivo, GPS para identificar dónde está ocurriendo y datos históricos para hacer seguimiento y tomar decisiones oportunas."*

El sistema está diseñado como una solución de agricultura de precisión desacoplada en tres capas principales:

```
[ Navegador Móvil / PWA ]  <=====>  [ Firebase Cloud Services ]
(Next.js App Router + Leaflet)       - Auth (Usuarios y Roles)
                                    - Firestore (Predios, Lotes, Diagnósticos)
                                    - Storage (Evidencia Fotográfica)
             |
             | multipart/form-data (imagen, cultivo, órgano)
             v
[ Microservicio de Visión por Computadora ]
(Python FastAPI - Uvicorn)
  - Preprocesamiento y normalización
  - Predictor desacoplado (MockPredictor / RealModelPredictor)
  - Pesos convolucionales o ViT (.keras / .pt)
```

---

## 2. Componentes del Sistema

### 2.1 Frontend Web / PWA (`/frontend`)
- **Framework**: Next.js 14 con App Router y Server/Client Components segregados.
- **Tipado**: TypeScript estricto con interfaces unificadas en `src/types/index.ts`.
- **Estilos**: Tailwind CSS con paleta agroecológica (`agro` esmeralda, `earth` cálido).
- **Mapas y Georreferenciación**: Leaflet y OpenStreetMap montados con importación dinámica (`ssr: false`) para evitar conflictos con el objeto global `window` en Next.js.
- **Gráficos**: Recharts para visualización de prevalencia patológica y evolución de estados sanitarios.
- **Optimización de Medios**: Compresión en cliente con Canvas HTML5 (`imageCompressor.ts`), reduciendo capturas móviles pesadas (15MB+) a menos de 800KB sin pérdida de características fitosanitarias relevantes.
- **Modo Demostración / Resiliencia**: Si `NEXT_PUBLIC_DEMO_MODE=true` o las credenciales no están configuradas, opera con persistencia local en `localStorage` con catálogo pre-cargado.

### 2.2 Microservicio de Inteligencia Artificial (`/backend`)
- **Framework**: FastAPI (Python 3.10+) con servidor ASGI Uvicorn.
- **Esquemas**: Pydantic v2 para validación estricta de entradas y respuestas.
- **Seguridad y Validación**:
  - Filtro estricto de tipos MIME (`image/jpeg`, `image/png`, `image/webp`).
  - Límite de tamaño configurable mediante variable `MAX_IMAGE_SIZE_MB`.
  - Validación de integridad de bytes vía Pillow (`Image.verify()`).
- **Arquitectura de Inferencia Desacoplada**:
  - `BasePredictor`: Interfaz abstracta con método `predict(image_bytes, crop_id, plant_part)`.
  - `MockPredictor`: Inferencia determinista basada en propiedades de imagen y catálogo de patologías oficiales.
  - `RealModelPredictor`: Cargador dinámico (`ModelLoader`) preparado para importar pesos `.keras`, `.h5` o `.pt`.

### 2.3 Capa de Datos y Seguridad (Firebase)
- **Authentication**: Inicio de sesión con correo y contraseña, persistencia de sesión y control de roles (`productor` y `administrador`).
- **Cloud Firestore**: Colecciones aisladas con reglas de seguridad estrictas (`firestore.rules`): los productores solo pueden leer y mutar sus propias fincas, parcelas y diagnósticos. Los catálogos maestros de cultivos y enfermedades son de libre lectura para autenticados.
- **Firebase Storage**: Almacenamiento organizado por usuario y diagnóstico (`diagnoses/{userId}/{diagnosisId}/image.jpg`) con validación de tipo y tamaño máximo (`storage.rules`).
