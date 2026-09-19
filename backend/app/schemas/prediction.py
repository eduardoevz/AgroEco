from pydantic import BaseModel, Field
from typing import Optional, Literal

PlantPart = Literal["leaf", "stem", "fruit"]
SeverityLevel = Literal["low", "moderate", "high", "severe"]

class PredictionResult(BaseModel):
    diseaseId: str = Field(..., description="Identificador único de la enfermedad detectada")
    diseaseName: str = Field(..., description="Nombre común de la enfermedad")
    scientificName: Optional[str] = Field(None, description="Nombre científico del patógeno")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Nivel de certeza de la IA entre 0.0 y 1.0")
    severity: SeverityLevel = Field(..., description="Severidad estimada de la afectación")
    botanicalObservation: Optional[str] = Field(None, description="Observación y justificación botánica visual")

class ModelInfo(BaseModel):
    version: str = Field(..., description="Versión del modelo de visión por computadora")
    mode: Literal["mock", "model", "gemini", "hybrid"] = Field(..., description="Modo de ejecución del motor de IA")
    disclaimer: str = Field(
        default="Este resultado es una estimación generada mediante inteligencia artificial y no sustituye la evaluación de un profesional agrícola.",
        description="Advertencia reglamentaria sobre el diagnóstico asistido"
    )

class PredictResponse(BaseModel):
    success: bool = True
    prediction: PredictionResult
    model: ModelInfo

class HealthResponse(BaseModel):
    status: str
    version: str
    ai_mode: str
    timestamp: str
