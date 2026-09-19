from abc import ABC, abstractmethod
from app.schemas.prediction import PredictionResult, ModelInfo

class BasePredictor(ABC):
    """
    Interfaz abstracta desacoplada para los motores de predicción de visión por computadora.
    Permite alternar entre MockPredictor y ModelPredictor (TensorFlow / PyTorch)
    sin modificar la capa de controladores/endpoints.
    """

    @property
    @abstractmethod
    def version(self) -> str:
        """Versión del modelo o del generador de predicciones."""
        pass

    @property
    @abstractmethod
    def mode(self) -> str:
        """Modo de ejecución: 'mock' o 'model'."""
        pass

    @abstractmethod
    async def predict(self, image_bytes: bytes, crop_id: str, plant_part: str) -> PredictionResult:
        """
        Ejecuta el análisis de la imagen y retorna el resultado estructurado.
        """
        pass

    def get_model_info(self) -> ModelInfo:
        return ModelInfo(
            version=self.version,
            mode=self.mode  # type: ignore
        )
