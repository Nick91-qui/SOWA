# backend/app/core/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Online Exam Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "postgresql://user:password@host:port/dbname"

    class Config:
        case_sensitive = True

settings = Settings()