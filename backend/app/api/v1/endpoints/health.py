from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.prediction import HealthResponse

router = APIRouter()

@router.get("/", response_model=HealthResponse, tags=["Health"])
@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        ai_mode=settings.AI_MODE,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
