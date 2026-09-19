import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, AlertCircle, Sun, Focus, Eye } from 'lucide-react';
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
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
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 shadow-sm max-w-md mx-auto aspect-square flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Muestra foliar o fruto a analizar"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={onImageRemoved}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            aria-label="Eliminar y cambiar fotografía"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white text-xs">
            <span className="truncate">{selectedFile?.name || 'Fotografía cargada'}</span>
            <span className="font-semibold text-emerald-400">
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {/* Botón Tomar Foto (Cámara Móvil) */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={compressing}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-emerald-500/70 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 transition-colors group active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">Tomar Fotografía</span>
            <span className="text-xs text-stone-500 mt-1">
              Abrir cámara del teléfono
            </span>
          </button>

          {/* Botón Subir Archivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={compressing}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/70 hover:bg-stone-100 text-stone-800 transition-colors group active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">Subir Archivo</span>
            <span className="text-xs text-stone-500 mt-1">
              Desde galería o computador
            </span>
          </button>
        </div>
      )}

      {/* Recomendaciones agronómicas de fotografía */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 space-y-2">
        <p className="font-semibold text-stone-800 flex items-center gap-1.5">
          <Focus className="w-4 h-4 text-emerald-700" />
          Recomendaciones para una óptima detección con IA:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-stone-600">
          <li className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Buena luz natural, sin sombras duras</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Focus className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            <span>Enfocar bien la mancha o síntoma</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Evitar movimiento al disparar</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
