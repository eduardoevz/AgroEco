# Hoja de Ruta Tecnológica Futura - Sistema Agraria

Funcionalidades de arquitectura avanzada planificadas para fases posteriores de evolución del producto:

---

## 1. Detección Avanzada & Visión por Computadora
- **Localización por Bounding Boxes / Segmentación**: Migrar de clasificación global a modelos de detección de objetos en tiempo real (ej. YOLOv8/v11 o Mask R-CNN) para delimitar exactamente las manchas y lesiones milimétricas sobre la hoja o fruto.
- **Comparación Temporal Automática**: Algoritmos de alineación de imágenes (Image Registration) para comparar visualmente la misma hoja en el tiempo y calcular el porcentaje exacto de reducción o avance de la lesión tras la aplicación de un fungicida.

## 2. Sensores IoT y Clima Micro-Local
- **Estaciones Agroclimáticas de Bajo Costo**: Integración vía MQTT/LoRaWAN de sensores de humedad relativa, temperatura foliar, radiación solar y horas de mojado de hoja.
- **Modelos Predictivos Epidemiológicos**: Cruzar la curva de rocío y temperatura con las condiciones biológicas requeridas por patógenos como *Pseudocercospora fijiensis* (Sigatoka negra) o *Hemileia vastatrix* (Roya del café) para anticipar alertas tempranas de brote antes de la aparición de síntomas visibles.

## 3. Teledetección con Drones y Satélites
- **Índices de Vegetación (NDVI, NDRE, GNDVI)**: Ingesta periódica de imágenes multiespectrales de constelaciones Sentinel-2 y PlanetScope para detectar áreas de estrés hídrico o clorótico a nivel macro en parcelas grandes.
- **Vuelos con Vehículos Aéreos no Tripulados (UAVs)**: Carga de ortomosaicos georreferenciados de alta resolución tomados por drones agrícolas para mapear parcelas completas en minutos.

## 4. Capacidades Móviles & Offline Avanzado
- **Offline Total con Background Sync**: Utilización de Service Workers completos e IndexedDB local para permitir tomar 100 fotos y registrar diagnósticos en zonas rurales profundas sin cobertura celular, sincronizando automáticamente al recuperar señal 3G/4G o Wi-Fi.
- **Notificaciones Push Agrícolas**: Alertas inmediatas enviadas al teléfono del productor ante brotes detectados en fincas colindantes o condiciones meteorológicas de alto riesgo biológico.
- **Exportación de Reportes Técnicos en PDF**: Generación de informes fitosanitarios detallados con sellos geográficos, firmas digitales y recomendaciones para trámites ante entidades certificadoras o aseguradoras agrícolas.

## 5. Asistencia Agronómica con IA Generativa
- **Copiloto Agronómico Multimodal**: Integración de modelos LLM especializados (ej: Google Gemini Pro / Flash) con RAG sobre literatura agronómica oficial (ICA, Cenicafé, Embrapa, FAO) para responder dudas de dosis, mezclas en tanque y compatibilidad de productos fitosanitarios.
