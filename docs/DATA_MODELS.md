# Modelos de Datos - Cloud Firestore

Diccionario de datos completo de las colecciones de Cloud Firestore en el proyecto Agraria.

---

## 1. Colección `users`
Ruta: `users/{userId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador único (Firebase Auth UID) |
| `name` | string | Sí | Nombre del productor o razón social |
| `email` | string | Sí | Correo electrónico principal |
| `phone` | string | No | Teléfono de contacto móvil |
| `role` | string | Sí | `'productor'` \| `'administrador'` |
| `createdAt` | string (ISO) | Sí | Fecha de registro |
| `updatedAt` | string (ISO) | Sí | Fecha de última modificación |

---

## 2. Colección `farms`
Ruta: `farms/{farmId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador único del predio |
| `ownerId` | string | Sí | UID del productor propietario |
| `name` | string | Sí | Nombre comercial o tradicional de la finca |
| `description` | string | No | Descripción general y características |
| `department` | string | Sí | Departamento o provincia geográfica |
| `municipality` | string | Sí | Municipio o cantón |
| `area` | number | Sí | Extensión superficial |
| `areaUnit` | string | Sí | `'ha'` \| `'m2'` \| `'mz'` |
| `latitude` | number | Sí | Coordenada latitudinal central |
| `longitude` | number | Sí | Coordenada longitudinal central |
| `createdAt` | string (ISO) | Sí | Fecha de alta |
| `updatedAt` | string (ISO) | Sí | Última actualización |

---

## 3. Colección `plots`
Ruta: `plots/{plotId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador de la parcela |
| `farmId` | string | Sí | ID de la finca a la que pertenece |
| `ownerId` | string | Sí | UID del propietario |
| `name` | string | Sí | Nombre o número del lote |
| `description` | string | No | Estado vegetativo o notas de lote |
| `cropId` | string | Sí | ID del cultivo sembrado |
| `area` | number | Sí | Extensión del lote |
| `areaUnit` | string | Sí | Unidad de medida |
| `latitude` | number | No | Latitud del centroide de la parcela |
| `longitude` | number | No | Longitud del centroide de la parcela |
| `createdAt` | string (ISO) | Sí | Fecha de creación |
| `updatedAt` | string (ISO) | Sí | Fecha de edición |

---

## 4. Colección `crops` (Maestro)
Ruta: `crops/{cropId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | `'arroz'`, `'maiz'`, `'frijol'`, `'cafe'`, `'tomate'`, `'platano'` |
| `name` | string | Sí | Nombre común del cultivo |
| `scientificName`| string | No | Nombre científico taxonómico |
| `description` | string | Sí | Descripción agronómica |
| `image` | string | No | URL de imagen ilustrativa |
| `active` | boolean | Sí | Estado de disponibilidad en el sistema |

---

## 5. Colección `diseases` (Maestro)
Ruta: `diseases/{diseaseId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador único de la patología |
| `cropId` | string | Sí | Cultivo hospedero |
| `name` | string | Sí | Nombre común de la enfermedad |
| `scientificName`| string | Sí | Patógeno causante (hongo, bacteria, virus) |
| `type` | string | Sí | `'fungal'` \| `'bacterial'` \| `'viral'` \| `'pest'` \| `'abiotic'` |
| `description` | string | Sí | Descripción epidemiológica y daños |
| `symptoms` | string[] | Sí | Lista de síntomas observables en campo |
| `recommendations`| string[] | Sí | Prácticas de manejo integrado |
| `affectedParts` | string[] | Sí | `['leaf', 'stem', 'fruit']` |
| `image` | string | No | Imagen de referencia |
| `active` | boolean | Sí | Si se incluye en los diagnósticos |

---

## 6. Colección `diagnoses`
Ruta: `diagnoses/{diagnosisId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador único del reporte |
| `userId` | string | Sí | UID del productor que tomó la muestra |
| `farmId` | string | Sí | Finca de origen |
| `plotId` | string | Sí | Parcela de origen |
| `cropId` | string | Sí | Cultivo inspeccionado |
| `plantPart` | string | Sí | `'leaf'` \| `'stem'` \| `'fruit'` |
| `imageUrl` | string | Sí | URL de la fotografía en Firebase Storage |
| `predictedDiseaseId` | string | Sí | Patología inferida por IA |
| `predictedDiseaseName` | string | Sí | Nombre legible de la patología |
| `confidence` | number | Sí | Certeza de la IA (0.0 a 1.0) |
| `severity` | string | Sí | `'low'` \| `'moderate'` \| `'high'` \| `'severe'` |
| `latitude` | number | Sí | Coordenada GPS capturada en campo |
| `longitude` | number | Sí | Coordenada GPS capturada en campo |
| `gpsAccuracy` | number | Sí | Margen de error en metros del sensor |
| `status` | string | Sí | `'detected'` \| `'monitoring'` \| `'treated'` \| `'controlled'` |
| `aiModelVersion` | string | Sí | Versión del motor de inferencia utilizado |
| `notes` | string | No | Observaciones del productor |
| `createdAt` | string (ISO) | Sí | Momento de toma y registro |
| `updatedAt` | string (ISO) | Sí | Último cambio de estado |

---

## 7. Colección `followUps`
Ruta: `followUps/{followUpId}`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | ID del registro de seguimiento |
| `diagnosisId` | string | Sí | ID del diagnóstico matriz |
| `userId` | string | Sí | UID del técnico o productor |
| `status` | string | Sí | Nuevo estado sanitario registrado |
| `notes` | string | Sí | Tratamiento aplicado o evolución observada |
| `imageUrl` | string | No | Fotografía de evidencia posterior |
| `createdAt` | string (ISO) | Sí | Fecha de la visita de seguimiento |
