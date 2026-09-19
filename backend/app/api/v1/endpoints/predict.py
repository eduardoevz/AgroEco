from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.core.config import settings
from app.core.logging import logger
from app.schemas.prediction import PredictResponse, PlantPart
from app.services.ai.predictor import get_predictor

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
}

VALID_PLANT_PARTS = {"leaf", "stem", "fruit"}

@router.post(
    "/predict",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Análisis fitosanitario con visión por computadora",
    description="Recibe una imagen agrícola junto con el cultivo y la parte de la planta afectada para generar un diagnóstico preliminar asistido por IA."
)
async def predict_plant_disease(
    image: UploadFile = File(..., description="Archivo de imagen (JPEG, PNG o WebP)"),
    cropId: str = Form(..., description="Identificador del cultivo (ej: 'platano', 'cafe', 'tomate')"),
    plantPart: str = Form(..., description="Parte de la planta afectada: 'leaf', 'stem' o 'fruit'")
):
    # 1. Validar Tipo MIME
    content_type = image.content_type or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato no permitido: '{content_type}'. Formatos válidos: JPEG, PNG, WebP."
        )

    # 2. Validar parte de la planta
    normalized_part = plantPart.strip().lower()
    if normalized_part not in VALID_PLANT_PARTS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Parte de la planta no válida: '{plantPart}'. Opciones válidas: 'leaf', 'stem', 'fruit'."
        )

    # 3. Leer y validar tamaño del archivo
    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo de imagen está vacío."
        )

    if len(image_bytes) > settings.max_image_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"La imagen excede el límite máximo de {settings.MAX_IMAGE_SIZE_MB}MB."
        )

    # 4. Inferencia con Predictor
    try:
        predictor = get_predictor()
        logger.info(f"Analizando imagen para cultivo: '{cropId}', órgano: '{normalized_part}' (modo: {predictor.mode})")
        
        prediction = await predictor.predict(
            image_bytes=image_bytes,
            crop_id=cropId,
            plant_part=normalized_part
        )

        return PredictResponse(
            success=True,
            prediction=prediction,
            model=predictor.get_model_info()
        )
    except ValueError as val_err:
        logger.warning(f"Error de validación de imagen: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.exception(f"Error inesperado procesando predicción con motor primario: {exc}. Activando fallback a Red Neuronal.")
        try:
            from app.services.ai.predictor import RealModelPredictor
            real_predictor = RealModelPredictor(settings.MODEL_PATH)
            fallback_prediction = await real_predictor.predict(
                image_bytes=image_bytes,
                crop_id=cropId,
                plant_part=normalized_part
            )
            return PredictResponse(
                success=True,
                prediction=fallback_prediction,
                model=real_predictor.get_model_info()
            )
        except Exception as fallback_exc:
            logger.warning(f"Red Neuronal no disponible en contingencia: {fallback_exc}. Activando catálogo agronómico.")
            try:
                from app.services.ai.mock_predictor import MockPredictor
                mock_predictor = MockPredictor()
                fallback_prediction = await mock_predictor.predict(
                    image_bytes=image_bytes,
                    crop_id=cropId,
                    plant_part=normalized_part
                )
                return PredictResponse(
                    success=True,
                    prediction=fallback_prediction,
                    model=mock_predictor.get_model_info()
                )
            except Exception as final_exc:
                logger.exception(f"Error crítico en fallback final: {final_exc}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Ocurrió un error interno procesando la imagen fitosanitaria."
                )
