import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, AlertCircle, Sun, Focus, Eye, Sparkles } from 'lucide-react';
import { compressImage } from '@/lib/utils/imageCompressor';

interface ImageUploaderProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onImageSelected: (file: File, previewUrl: string) => void;
  onImageRemoved: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedFile,
  previewUrl,
  onImageSelected,
  onImageRemoved,
}) => {
  const [compressing, setCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Validar tipo MIME
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Formato no compatible. Por favor sube una imagen JPEG, PNG o WebP.');
      return;
    }

    try {
      setCompressing(true);
      // Comprimir foto de cámara si es grande
      const compressed = await compressImage(file);
      const url = URL.createObjectURL(compressed);
      onImageSelected(compressed, url);
    } catch (err) {
      console.error('Error procesando imagen:', err);
      // Si falla la compresión, usar el archivo original
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Preview or Selector */}
      {previewUrl ? (
        <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl max-w-md mx-auto aspect-square flex items-center justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Muestra foliar o fruto a analizar"
            className="w-full h-full object-contain"
          />

          {/* Visor de escáner agronómico con retículas */}
          <div className="absolute inset-4 pointer-events-none border border-emerald-500/30 rounded-2xl">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
          </div>

          <button
            type="button"
            onClick={onImageRemoved}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-rose-600 text-white backdrop-blur-md transition-colors shadow-lg"
            aria-label="Eliminar y cambiar fotografía"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-black/70 backdrop-blur-md text-white text-xs border border-white/10">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate font-medium">{selectedFile?.name || 'Fotografía cargada'}</span>
            </div>
            <span className="font-semibold text-emerald-400 ml-2">
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Botón Tomar Foto (Cámara Móvil) */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={compressing}
            className="flex flex-col items-center justify-center p-7 rounded-3xl border-2 border-dashed border-emerald-500/60 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 transition-all group active:scale-[0.98] shadow-sm hover:shadow-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center mb-3.5 shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Capturar con Cámara
            </span>
            <span className="text-xs text-slate-500 mt-1 font-medium">
              Apertura directa en smartphone o tablet
            </span>
          </button>

          {/* Botón Subir Archivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={compressing}
            className="flex flex-col items-center justify-center p-7 rounded-3xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-white text-slate-800 transition-all group active:scale-[0.98] shadow-sm hover:shadow-card-hover"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center mb-3.5 group-hover:scale-105 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all">
              <Upload className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Cargar Archivo Local
            </span>
            <span className="text-xs text-slate-500 mt-1 font-medium">
              Desde galería o disco local (JPG, PNG)
            </span>
          </button>
        </div>
      )}

      {/* Recomendaciones agronómicas de fotografía */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
        <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
          <Focus className="w-4 h-4 text-emerald-600" />
          Requisitos para máxima precisión del motor de IA:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
          <li className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
            <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Luz natural abundante, sin sombras duras</span>
          </li>
          <li className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
            <Focus className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Enfocar el síntoma central a 15-25 cm</span>
          </li>
          <li className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
            <Eye className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>Evitar imágenes borrosas o desenfocadas</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

