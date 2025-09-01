# backend/app/core/config.py

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Online Exam Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite+pysqlite:///./app.db"

    class Config:
        case_sensitive = True

settings = Settings()