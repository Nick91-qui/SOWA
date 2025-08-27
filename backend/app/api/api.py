# backend/app/api/api.py

from fastapi import APIRouter

from app.api.endpoints import login, users, fraud

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["fraud"])