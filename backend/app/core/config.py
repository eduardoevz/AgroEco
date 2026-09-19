import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    PROJECT_NAME: str = "AgroEco AI Vision API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    AI_MODE: str = "model"  # "mock" | "model" | "gemini" | "hybrid"
    MODEL_PATH: str = "app/services/ai/weights/crop_disease_mobilenet.pt"
    GEMINI_API_KEY: Optional[str] = None
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,*"
    MAX_IMAGE_SIZE_MB: int = 10
    LOG_LEVEL: str = "INFO"

    @property
    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return ["http://localhost:3000", "http://127.0.0.1:3000"]
        origins = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip() and origin.strip() != "*"]
        return origins if origins else ["*"]

    @property
    def max_image_size_bytes(self) -> int:
        return self.MAX_IMAGE_SIZE_MB * 1024 * 1024

settings = Settings()
