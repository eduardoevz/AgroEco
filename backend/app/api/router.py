from fastapi import APIRouter
from app.api.v1.endpoints import health, predict

api_router = APIRouter()

# Health endpoints en la raíz y en v1
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])
