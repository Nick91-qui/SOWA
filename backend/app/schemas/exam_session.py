"""Módulo que define os schemas Pydantic para sessões de exame e respostas."""

from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel


class ExamResponseBase(BaseModel):
    """Schema base para uma resposta de questão de exame."""
    question_id: int
    answer: Any


class ExamResponseCreate(ExamResponseBase):
    """Schema para criação de uma nova resposta de questão."""
    pass


class ExamResponse(ExamResponseBase):
    """Schema para representação completa de uma resposta de questão, incluindo metadados."""
    id: int
    session_id: int
    is_correct: Optional[bool] = None
    points_earned: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class ExamSessionBase(BaseModel):
    """Schema base para uma sessão de exame."""
    exam_id: int


class ExamSessionCreate(ExamSessionBase):
    """Schema para criação de uma nova sessão de exame."""
    pass


class ExamSessionUpdate(BaseModel):
    """Schema para atualização de uma sessão de exame existente."""
    is_active: Optional[bool] = None
    status: Optional[str] = None
    end_time: Optional[datetime] = None


class ExamSession(ExamSessionBase):
    """Schema para representação completa de uma sessão de exame, incluindo metadados e respostas."""
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    is_active: bool
    status: str
    score: Optional[float] = None
    responses: List[ExamResponse] = []

    class Config:
        from_attributes = True