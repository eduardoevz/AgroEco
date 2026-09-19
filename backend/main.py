from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"=== {settings.PROJECT_NAME} v{settings.VERSION} iniciado en modo {settings.AI_MODE.upper()} ===")
    yield
    logger.info(f"=== {settings.PROJECT_NAME} finalizado ===")

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="API REST de Visión por Computadora para Detección Temprana y Monitoreo de Enfermedades Agrícolas.",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan
    )

    # Configuración de CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Incluir enrutador de endpoints
    application.include_router(api_router)

    return application

app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
