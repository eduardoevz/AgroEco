'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getFarms,
  getPlotsByFarm,
  getCrops,
  getDiseases,
  saveDiagnosis,
} from '@/lib/firebase/firestore';
import { uploadDiagnosisImage } from '@/lib/firebase/storage';
import { analyzeCropImage } from '@/lib/api/client';
import { Farm, Plot, Crop, Disease, PlantPart, Diagnosis } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { CropSelector } from '@/components/analysis/CropSelector';
import { PlantPartSelector } from '@/components/analysis/PlantPartSelector';
import { ImageUploader } from '@/components/analysis/ImageUploader';
import { LocationCapture } from '@/components/analysis/LocationCapture';
import { PredictionResult } from '@/components/analysis/PredictionResult';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  Trees,
  Layers,
  Sprout,
  Leaf,
  Camera,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ScanLine,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

function AnalyzeWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Paso actual (1 al 7, 8: procesando, 9: resultado)
  const [step, setStep] = useState<number>(1);

  // Datos del asistente
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  // Selecciones del usuario
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [selectedPlantPart, setSelectedPlantPart] = useState<PlantPart>('leaf');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  // Estados de proceso
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [savedDiagnosis, setSavedDiagnosis] = useState<Diagnosis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar datos iniciales y preseleccionar desde URL si existen
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [f, c, d] = await Promise.all([getFarms(user.id), getCrops(), getDiseases()]);
        setFarms(f);
        setCrops(c);
        setDiseases(d);

        // Preselección por URL query params
        const urlFarmId = searchParams.get('farmId');
        const urlPlotId = searchParams.get('plotId');
        const urlCropId = searchParams.get('cropId');

        if (urlFarmId) {
          setSelectedFarmId(urlFarmId);
          const p = await getPlotsByFarm(urlFarmId);
          setPlots(p);

          if (urlPlotId) {
            setSelectedPlotId(urlPlotId);
            const foundPlot = p.find((item) => item.id === urlPlotId);
            if (foundPlot) {
              setSelectedCropId(foundPlot.cropId);
              setStep(4); // Saltar directo a seleccionar parte si ya tiene finca, parcela y cultivo
            }
          } else if (urlCropId) {
            setSelectedCropId(urlCropId);
            setStep(3);
          } else {
            setStep(2);
          }
        }
      } catch (err) {
        console.error('Error cargando asistente:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, [user, searchParams]);

  // Cuando cambia la finca seleccionada, recargar las parcelas correspondientes
  const handleFarmSelect = async (farmId: string) => {
    setSelectedFarmId(farmId);
    setSelectedPlotId('');
    setSelectedCropId('');
    const p = await getPlotsByFarm(farmId);
    setPlots(p);
  };

  // Cuando cambia la parcela seleccionada, inferir automáticamente el cultivo
  const handlePlotSelect = (plotId: string) => {
    setSelectedPlotId(plotId);
    const p = plots.find((item) => item.id === plotId);
    if (p && p.cropId) {
      setSelectedCropId(p.cropId);
    }
  };

  // Ejecución del análisis y guardado automático
  const executeAnalysis = async () => {
    if (!user || !selectedImageFile || !selectedCropId) return;

    setStep(8); // Pantalla de procesamiento
    setErrorMessage(null);

    try {
      // 1. Preparar imagen
      setProcessingStage('Preparando imagen fitosanitaria...');
      await new Promise((r) => setTimeout(r, 600));

      // 2. Analizar patrones
      setProcessingStage('Analizando patrones celulares y foliares...');
      await new Promise((r) => setTimeout(r, 600));

      // 3. Procesar con IA (FastAPI)
      setProcessingStage('Procesando con inteligencia artificial...');
      const apiResponse = await analyzeCropImage(
        selectedImageFile,
        selectedCropId,
        selectedPlantPart
      );

      // 4. Subir imagen a Firebase Storage
      setProcessingStage('Almacenando fotografía en repositorio seguro...');
      const tempDiagId = 'diag-' + Date.now();
      const storedImageUrl = await uploadDiagnosisImage(
        selectedImageFile,
        user.id,
        tempDiagId
      );

      // 5. Guardado automático en Firestore
      setProcessingStage('Registrando diagnóstico preliminar en Firestore...');
      const fallbackLat = farms.find((f) => f.id === selectedFarmId)?.latitude || 4.5389;
      const fallbackLng = farms.find((f) => f.id === selectedFarmId)?.longitude || -75.6757;

      const created = await saveDiagnosis({
        userId: user.id,
        farmId: selectedFarmId,
        plotId: selectedPlotId,
        cropId: selectedCropId,
        plantPart: selectedPlantPart,
        imageUrl: storedImageUrl,
        predictedDiseaseId: apiResponse.prediction.diseaseId,
        predictedDiseaseName: apiResponse.prediction.diseaseName,
        confidence: apiResponse.prediction.confidence,
        severity: apiResponse.prediction.severity,
        latitude: coordinates?.latitude || fallbackLat,
        longitude: coordinates?.longitude || fallbackLng,
        gpsAccuracy: coordinates?.accuracy || 100,
        status: 'detected',
        aiModelVersion: apiResponse.model.version,
        notes: `Analizado mediante órgano: ${selectedPlantPart}. Certeza IA: ${(
          apiResponse.prediction.confidence * 100
        ).toFixed(1)}%` + (apiResponse.prediction.botanicalObservation ? ` | Observación: ${apiResponse.prediction.botanicalObservation}` : ''),
      });

      setSavedDiagnosis(created);
      setStep(9); // Pantalla de Resultado
    } catch (err: any) {
      console.error('Error durante el análisis:', err);
      setErrorMessage(
        err.message || 'Ocurrió un inconveniente procesando el análisis. Inténtalo de nuevo.'
      );
      setStep(7); // Regresar a confirmación
    }
  };

  const handleResetAnalysis = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setCoordinates(null);
    setSavedDiagnosis(null);
    setStep(1);
  };

  if (loadingInitial) {
    return <LoadingState message="Inicializando asistente de análisis..." />;
  }

  // Si no tiene fincas creadas, pedirle que cree una primero
  if (farms.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <Trees className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-stone-900 mb-1">
          Primero registra una finca
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Para asociar los análisis fitosanitarios y verlos en el mapa necesitas al menos una finca y una parcela.
        </p>
        <button
          type="button"
          onClick={() => router.push('/farms')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm"
        >
          Ir a Registrar Finca
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Cabecera del Asistente */}
      <PageTitle
        title="Análisis Fitosanitario Asistido por IA"
        subtitle={
          step <= 7
            ? `Paso ${step} de 7: ${
                [
                  'Seleccionar Finca',
                  'Seleccionar Parcela',
                  'Confirmar Cultivo',
                  'Parte de la Planta',
                  'Capturar Fotografía',
                  'Coordenadas GPS',
                  'Confirmar y Procesar',
                ][step - 1]
              }`
            : step === 8
            ? 'Procesando Muestra'
            : 'Diagnóstico Preliminar'
        }
      />

      {/* Barra de progreso de pasos */}
      {step <= 7 && (
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ================= PASO 1: FINCA ================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>Paso 1: ¿En qué finca se encuentra la planta?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {farms.map((f) => {
              const isSelected = selectedFarmId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFarmSelect(f.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-stone-900">{f.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {f.municipality}, {f.department} · {f.area} {f.areaUnit}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              disabled={!selectedFarmId}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 2: PARCELA ================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Paso 2: ¿En qué parcela o lote tomaste la muestra?</span>
          </div>

          {plots.length === 0 ? (
            <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
              <p className="text-xs text-stone-600">
                Esta finca no tiene parcelas registradas aún.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/farms/${selectedFarmId}`)}
                className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl"
              >
                Crear parcela en la finca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plots.map((p) => {
                const isSelected = selectedPlotId === p.id;
                const crop = crops.find((c) => c.id === p.cropId);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePlotSelect(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <h4 className="text-sm font-bold text-stone-900">{p.name}</h4>
                    <span className="inline-block text-[11px] font-semibold text-emerald-700 mt-1">
                      Cultivo: {crop?.name || p.cropId}
                    </span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {p.area} {p.areaUnit}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              disabled={!selectedPlotId}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 3: CULTIVO ================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Paso 3: Confirma o selecciona el cultivo a inspeccionar</span>
          </div>

          <CropSelector
            crops={crops}
            selectedCropId={selectedCropId}
            onSelect={(cropId) => setSelectedCropId(cropId)}
          />

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              disabled={!selectedCropId}
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 4: PARTE DE LA PLANTA ================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <span>Paso 4: ¿Qué órgano o parte de la planta estás analizando?</span>
          </div>

          <PlantPartSelector
            selectedPart={selectedPlantPart}
            onSelect={(part) => setSelectedPlantPart(part)}
          />

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 5: TOMAR / SUBIR FOTO ================= */}
      {step === 5 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Paso 5: Fotografía de la parte afectada</span>
          </div>

          <ImageUploader
            selectedFile={selectedImageFile}
            previewUrl={imagePreviewUrl}
            onImageSelected={(file, url) => {
              setSelectedImageFile(file);
              setImagePreviewUrl(url);
            }}
            onImageRemoved={() => {
              setSelectedImageFile(null);
              setImagePreviewUrl(null);
            }}
          />

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              disabled={!selectedImageFile}
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continuar con GPS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 6: GPS ================= */}
      {step === 6 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Paso 6: Georreferenciación Satelital</span>
          </div>

          <LocationCapture
            location={coordinates}
            onLocationObtained={(coords) => setCoordinates(coords)}
            onLocationSkipped={() => {
              const farm = farms.find((f) => f.id === selectedFarmId);
              setCoordinates({
                latitude: farm?.latitude || 4.5389,
                longitude: farm?.longitude || -75.6757,
                accuracy: 100,
              });
            }}
            defaultCoords={
              selectedFarmId
                ? {
                    latitude: farms.find((f) => f.id === selectedFarmId)?.latitude || 4.5389,
                    longitude: farms.find((f) => f.id === selectedFarmId)?.longitude || -75.6757,
                  }
                : undefined
            }
          />

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(7)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all"
            >
              <span>Previsualizar y Confirmar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 7: CONFIRMAR ANÁLISIS ================= */}
      {step === 7 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Paso 7: Confirmar datos antes de enviar al motor de IA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto preview */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              {imagePreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreviewUrl}
                  alt="Muestra a analizar"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Resumen de configuración */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px] font-bold uppercase">
                  Finca y Parcela
                </span>
                <span className="font-bold text-stone-800 text-sm">
                  {farms.find((f) => f.id === selectedFarmId)?.name}
                </span>
                <p className="text-stone-500">
                  Parcela: {plots.find((p) => p.id === selectedPlotId)?.name}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px] font-bold uppercase">
                  Cultivo y Órgano
                </span>
                <span className="font-bold text-stone-800 text-sm">
                  {crops.find((c) => c.id === selectedCropId)?.name}
                </span>
                <p className="text-stone-500 capitalize">
                  Órgano analizado: {selectedPlantPart}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px] font-bold uppercase">
                  Ubicación GPS
                </span>
                {coordinates ? (
                  <p className="font-mono text-stone-700">
                    Lat: {coordinates.latitude}, Lon: {coordinates.longitude} (±{coordinates.accuracy}m)
                  </p>
                ) : (
                  <p className="text-amber-700">Sin GPS exacto fijado.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={executeAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-md active:scale-98"
            >
              <ScanLine className="w-4 h-4" />
              <span>Procesar Análisis con IA</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 8: PROCESANDO ================= */}
      {step === 8 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-sm space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">
              Procesando Diagnóstico Asistido
            </h3>
            <p className="text-xs font-medium text-emerald-700">
              {processingStage}
            </p>
          </div>

          <div className="space-y-2 text-left bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Extracción de características visuales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inferencia sobre patologías en {crops.find((c) => c.id === selectedCropId)?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Validación fitosanitaria y persistencia</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= PASO 9: RESULTADO ================= */}
      {step === 9 && savedDiagnosis && (
        <PredictionResult
          diagnosis={savedDiagnosis}
          crop={crops.find((c) => c.id === savedDiagnosis.cropId)}
          disease={diseases.find((d) => d.id === savedDiagnosis.predictedDiseaseId)}
          onNewAnalysis={handleResetAnalysis}
        />
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando módulo de análisis..." />}>
      <AnalyzeWizard />
    </Suspense>
  );
}
