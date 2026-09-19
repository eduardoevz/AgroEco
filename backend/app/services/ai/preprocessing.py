import io
from typing import Tuple
from PIL import Image
import numpy as np

def validate_and_load_image(image_bytes: bytes) -> Image.Image:
    """
    Valida que los bytes correspondan a una imagen válida (JPEG, PNG, WebP)
    y la convierte a modo RGB.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()  # Verifica integridad
        # Reabrir porque verify() invalida el puntero de lectura
        image = Image.open(io.BytesIO(image_bytes))
        return image.convert("RGB")
    except Exception as e:
        raise ValueError(f"Formato de imagen inválido o corrupto: {str(e)}")

def preprocess_for_inference(
    image: Image.Image,
    target_size: Tuple[int, int] = (224, 224),
    normalize: bool = True
) -> np.ndarray:
    """
    Redimensiona la imagen al tamaño de entrada del modelo y normaliza los tensores.
    """
    resized = image.resize(target_size, Image.Resampling.BILINEAR)
    img_array = np.array(resized, dtype=np.float32)
    
    if normalize:
        # Normalización estándar 0-1
        img_array = img_array / 255.0

    # Expandir dimensiones para batch [1, H, W, C]
    return np.expand_dims(img_array, axis=0)
