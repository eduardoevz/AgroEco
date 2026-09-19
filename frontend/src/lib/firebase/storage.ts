import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isDemoMode } from './config';

// Función auxiliar para convertir imagen a Data URL comprimida si Storage no está disponible
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(img.src);
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => resolve(reader.result as string);
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export async function uploadDiagnosisImage(
  file: File,
  userId: string,
  diagnosisId: string
): Promise<string> {
  if (isDemoMode || !storage) {
    return fileToDataUrl(file);
  }

  try {
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filePath = `diagnoses/${userId}/${diagnosisId}/image_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, filePath);

    // Intentar subir a Firebase Storage con un timeout de 4 segundos
    // Si el bucket no está activado en Firebase Console o la red falla, pasa al fallback
    const uploadPromise = uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        userId,
        diagnosisId,
        uploadedAt: new Date().toISOString(),
      },
    }).then((snapshot) => getDownloadURL(snapshot.ref));

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Storage timeout o bucket no inicializado')), 4000)
    );

    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firebase Storage no disponible o no activado aún en Firebase Console. Guardando imagen en formato optimizado:', err);
    return fileToDataUrl(file);
  }
}

export async function uploadFollowUpImage(
  file: File,
  userId: string,
  followUpId: string
): Promise<string> {
  if (isDemoMode || !storage) {
    return fileToDataUrl(file);
  }

  try {
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filePath = `followups/${userId}/${followUpId}/image_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, filePath);

    const uploadPromise = uploadBytes(storageRef, file, {
      contentType: file.type,
    }).then((snapshot) => getDownloadURL(snapshot.ref));

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Storage timeout')), 4000)
    );

    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firebase Storage no disponible para seguimiento. Guardando localmente:', err);
    return fileToDataUrl(file);
  }
}
