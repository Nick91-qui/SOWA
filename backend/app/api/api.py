# backend/app/api/api.py

from fastapi import APIRouter

from app.api.endpoints import login, users, fraud, exam, exam_session

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["fraud"])
api_router.include_router(exam.router, prefix="/exams", tags=["exams"])
api_router.include_router(exam_session.router, prefix="/exam-sessions", tags=["exam-sessions"])