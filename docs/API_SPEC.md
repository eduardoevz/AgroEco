# Especificación de API REST - FastAPI Backend

Microservicio de visión por computadora para diagnóstico fitosanitario.

---

## 1. Verificación de Estado

### `GET /health` y `GET /`
Verifica que el servicio esté en línea y reporta el modo activo de inferencia (`mock` o `model`).

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "ai_mode": "mock",
  "timestamp": "2026-09-13T16:58:07.458291+00:00"
}
```

---

## 2. Inferencia Fitosanitaria

### `POST /api/v1/predict`
Recibe una imagen fotográfica junto con metadatos del cultivo y órgano vegetal para generar una estimación fitosanitaria preliminar.

**Cabecera:**
- `Content-Type: multipart/form-data`

**Parámetros:**
- `image` (Archivo binario): Archivo en formato JPEG, PNG o WebP. Tamaño máximo: 10MB (configurable).
- `cropId` (string en Form-Data): Identificador del cultivo (ej: `'platano'`, `'cafe'`, `'maiz'`).
- `plantPart` (string en Form-Data): Órgano analizado: `'leaf'`, `'stem'`, `'fruit'`.

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "prediction": {
    "diseaseId": "sigatoka_negra_platano",
    "diseaseName": "Sigatoka negra",
    "scientificName": "Pseudocercospora fijiensis",
    "confidence": 0.93,
    "severity": "high"
  },
  "model": {
    "version": "mock-v1.0.0",
    "mode": "mock",
    "disclaimer": "Este resultado es una estimación generada mediante inteligencia artificial y no sustituye la evaluación de un profesional agrícola."
  }
}
```

**Errores Comunes:**
- `400 Bad Request`: Formato no permitido (MIME type no es imagen) o archivo vacío.
- `413 Request Entity Too Large`: La imagen supera los 10MB permitidos.
- `422 Unprocessable Content`: `plantPart` no pertenece a `['leaf', 'stem', 'fruit']`.
- `500 Internal Server Error`: Falla interna no controlada durante el análisis matricial.
