# backend/app/main.py

from dotenv import load_dotenv

from fastapi import FastAPI
from app.api.api import api_router
from app.core.config import settings

load_dotenv()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Online Exam Platform API"}