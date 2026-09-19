import json
import os
import hashlib
from typing import Dict, Any, Optional
from app.services.ai.base import BasePredictor
from app.services.ai.preprocessing import validate_and_load_image
from app.schemas.prediction import PredictionResult, SeverityLevel

class MockPredictor(BasePredictor):
    """
    Predictor simulado para desarrollo, pruebas unitarias y entornos sin GPU.
    Retorna resultados consistentes y estructurados basados en el catálogo oficial
    de cultivos y enfermedades agrícolas.
    """

    def __init__(self, catalog_path: Optional[str] = None):
        if catalog_path is None:
            catalog_path = os.path.join(os.path.dirname(__file__), "classes.json")
        
        with open(catalog_path, "r", encoding="utf-8") as f:
            self.catalog: Dict[str, Any] = json.load(f)

    @property
    def version(self) -> str:
        return "mock-v1.0.0"

    @property
    def mode(self) -> str:
        return "mock"

    def _normalize_crop_key(self, crop_id: str) -> str:
        key = crop_id.lower().strip()
        replacements = {
            "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
            "plátano": "platano", "café": "cafe", "maíz": "maiz"
        }
        for orig, rep in replacements.items():
            key = key.replace(orig, rep)
        return key

    async def predict(self, image_bytes: bytes, crop_id: str, plant_part: str) -> PredictionResult:
        # Validar la imagen primero para rechazar archivos corruptos o no-imagen
        validate_and_load_image(image_bytes)

        crop_key = self._normalize_crop_key(crop_id)
        crops_dict = self.catalog.get("crops", {})

        # Si el cultivo no coincide exactamente, buscar coincidencia parcial o usar platano por defecto
        crop_data = None
        for k, v in crops_dict.items():
            if k in crop_key or crop_key in k:
                crop_data = v
                break
        
        if not crop_data:
            crop_data = crops_dict.get("platano", list(crops_dict.values())[0])

        diseases = crop_data.get("diseases", [])

        # Filtrar por parte de la planta si es posible
        matched_diseases = [
            d for d in diseases if plant_part.lower() in [p.lower() for p in d.get("affectedParts", [])]
        ]
        if not matched_diseases:
            matched_diseases = diseases

        # Selección determinista según hash de la imagen para que la misma foto devuelva el mismo resultado
        img_hash = int(hashlib.md5(image_bytes).hexdigest(), 16)
        selected_disease = matched_diseases[img_hash % len(matched_diseases)]

        # Confianza calculada entre 0.84 y 0.96
        confidence_delta = (img_hash % 120) / 1000.0  # 0.000 a 0.120
        confidence = round(0.84 + confidence_delta, 2)

        # Severidad
        severity_options: list[SeverityLevel] = ["low", "moderate", "high", "severe"]
        default_sev = selected_disease.get("defaultSeverity", "moderate")
        severity = default_sev if default_sev in severity_options else "moderate"

        return PredictionResult(
            diseaseId=selected_disease["id"],
            diseaseName=selected_disease["name"],
            scientificName=selected_disease.get("scientificName"),
            confidence=confidence,
            severity=severity
        )
