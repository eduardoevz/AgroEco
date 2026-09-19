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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full uppercase">
            {step <= 7 ? `Etapa ${step} de 7` : step === 8 ? 'Inferencia Activa' : 'Dictamen Final'}
          </span>
          {step <= 7 && (
            <span className="text-xs font-semibold text-slate-500">
              {Math.round((step / 7) * 100)}% Completado
            </span>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {step <= 7
            ? [
                'Selecciona la Finca de Origen',
                'Selecciona la Parcela o Lote',
                'Confirma el Cultivo Evaluado',
                'Órgano o Tejido Afectado',
                'Fotografía de la Muestra',
                'Georreferenciación en Campo',
                'Confirmación y Pre-vuelo',
              ][step - 1]
            : step === 8
            ? 'Analizando con Inteligencia Artificial'
            : 'Resultado del Diagnóstico'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {step <= 7
            ? 'Sigue el protocolo asistido para garantizar diagnósticos fitosanitarios de máxima precisión.'
            : step === 8
            ? 'Extrayendo descriptores fitopatológicos con Gemini 3.6 Flash y redes neuronales convolucionales.'
            : 'Reporte clínico con recomendaciones de manejo integrado.'}
        </p>
      </div>

      {/* Stepper de progreso visual */}
      {step <= 7 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-600 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 6) * 100}%` }}
            />
            {[1, 2, 3, 4, 5, 6, 7].map((s) => {
              const isPast = s < step;
              const isCurrent = s === step;
              return (
                <div
                  key={s}
                  className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isPast
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20 shadow-md'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ================= PASO 1: FINCA ================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>Paso 1: ¿En qué predio o finca se tomó la muestra?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {farms.map((f) => {
              const isSelected = selectedFarmId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFarmSelect(f.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 group ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30 shadow-sm'
                      : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-slate-50/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {f.name}
                    </h4>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {f.municipality}, {f.department} · {f.area} {f.areaUnit}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={!selectedFarmId}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 2: PARCELA ================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Paso 2: ¿En qué lote o parcela se encuentra el cultivo?</span>
          </div>

          {plots.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <p className="text-xs font-medium text-slate-600">
                Esta finca aún no tiene parcelas registradas.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/farms/${selectedFarmId}`)}
                className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
              >
                Crear Parcela en esta Finca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {plots.map((p) => {
                const isSelected = selectedPlotId === p.id;
                const crop = crops.find((c) => c.id === p.cropId);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePlotSelect(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 group ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30 shadow-sm'
                        : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-slate-50/60 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {p.name}
                      </h4>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                      Cultivo: {crop?.name || p.cropId}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Área: {p.area} {p.areaUnit}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              disabled={!selectedPlotId}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 3: CULTIVO ================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Paso 3: Confirma o selecciona el cultivo a inspeccionar</span>
          </div>

          <CropSelector
            crops={crops}
            selectedCropId={selectedCropId}
            onSelect={(cropId) => setSelectedCropId(cropId)}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              disabled={!selectedCropId}
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 4: PARTE DE LA PLANTA ================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Paso 4: ¿Qué órgano o tejido presenta la sintomatología?</span>
          </div>

          <PlantPartSelector
            selectedPart={selectedPlantPart}
            onSelect={(part) => setSelectedPlantPart(part)}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 5: FOTOGRAFÍA ================= */}
      {step === 5 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Paso 5: Captura o sube la fotografía de la muestra</span>
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              disabled={!selectedImageFile}
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] disabled:opacity-40"
            >
              <span>Continuar con GPS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 6: GPS ================= */}
      {step === 6 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Paso 6: Georreferenciación Satelital GNSS</span>
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(7)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
            >
              <span>Previsualizar y Confirmar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 7: CONFIRMAR ANÁLISIS ================= */}
      {step === 7 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Paso 7: Confirmar datos antes de enviar al motor de IA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm flex items-center justify-center">
              {imagePreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreviewUrl}
                  alt="Muestra a analizar"
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase">
                Muestra Seleccionada
              </div>
            </div>

            {/* Resumen de configuración */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Finca y Parcela
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {farms.find((f) => f.id === selectedFarmId)?.name}
                </span>
                <p className="text-slate-500 font-medium">
                  Parcela: {plots.find((p) => p.id === selectedPlotId)?.name}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Cultivo y Órgano
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {crops.find((c) => c.id === selectedCropId)?.name}
                </span>
                <p className="text-slate-500 capitalize font-medium">
                  Órgano analizado: {selectedPlantPart}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Ubicación GNSS
                </span>
                {coordinates ? (
                  <p className="font-mono font-bold text-slate-800">
                    {coordinates.latitude}, {coordinates.longitude} (±{coordinates.accuracy}m)
                  </p>
                ) : (
                  <p className="text-amber-700 font-medium">Coordenadas aproximadas de la finca.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={executeAnalysis}
              className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-lg shadow-emerald-700/25 active:scale-[0.98]"
            >
              <ScanLine className="w-4 h-4" />
              <span>Ejecutar Diagnóstico IA</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 8: PROCESANDO ================= */}
      {step === 8 && (
        <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl border border-emerald-900/40 p-12 text-center shadow-2xl space-y-6 max-w-lg mx-auto">
          {/* Radar Waves animadas */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-emerald-500/30 animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">
              Motor de Visión Agroecológica
            </h3>
            <p className="text-xs font-semibold text-emerald-400 animate-pulse">
              {processingStage}
            </p>
          </div>

          <div className="space-y-2.5 text-left bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Extracción y filtrado de características celulares</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Clasificación fitopatológica sobre {crops.find((c) => c.id === selectedCropId)?.name}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin flex-shrink-0" />
              <span>Georreferenciación y persistencia en Cloud Firestore</span>
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
