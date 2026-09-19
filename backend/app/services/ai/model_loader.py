import os
from typing import Any, Optional
from app.core.logging import logger

class ModelLoader:
    """
    Cargador desacoplado para modelos de visión por computadora.
    Soporta TensorFlow/Keras (.keras, .h5) y PyTorch (.pt, .pth).
    """

    @staticmethod
    def load_model(model_path: str) -> Optional[Any]:
        if not os.path.exists(model_path):
            logger.warning(f"Archivo de pesos del modelo no encontrado en: {model_path}")
            return None

        ext = os.path.splitext(model_path)[1].lower()

        if ext in [".keras", ".h5"]:
            try:
                import tensorflow as tf  # type: ignore
                logger.info(f"Cargando modelo Keras desde {model_path}")
                return tf.keras.models.load_model(model_path)
            except ImportError:
                logger.error("TensorFlow no está instalado para cargar el modelo .keras")
                return None
            except Exception as e:
                logger.error(f"Error al cargar modelo Keras: {e}")
                return None

        elif ext in [".pt", ".pth"]:
            try:
                import torch  # type: ignore
                logger.info(f"Cargando modelo PyTorch desde {model_path}")
                try:
                    model = torch.load(model_path, map_location="cpu", weights_only=False)
                except TypeError:
                    model = torch.load(model_path, map_location="cpu")
                model.eval()
                return model
            except ImportError:
                logger.error("PyTorch no está instalado para cargar el modelo .pt")
                return None
            except Exception as e:
                logger.error(f"Error al cargar modelo PyTorch: {e}")
                return None

        else:
            logger.warning(f"Formato de modelo no reconocido: {ext}")
            return None
