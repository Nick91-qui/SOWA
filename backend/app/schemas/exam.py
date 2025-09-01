"""Módulo que define os schemas Pydantic para exames e questões."""

from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel


class QuestionBase(BaseModel):
    """Schema base para uma questão de exame."""
    content: str
    question_type: str
    options: Optional[Any] = None
    correct_answer: Optional[Any] = None
    validation_rules: Optional[Any] = None
    points: int = 1


class QuestionCreate(QuestionBase):
    """Schema para criação de uma nova questão."""
    pass


class QuestionUpdate(QuestionBase):
    """Schema para atualização de uma questão existente."""
    content: Optional[str] = None
    question_type: Optional[str] = None
    points: Optional[int] = None


class Question(QuestionBase):
    """Schema para representação completa de uma questão, incluindo metadados."""
    id: int
    exam_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExamBase(BaseModel):
    """Schema base para um exame."""
    title: str
    description: Optional[str] = None


class ExamCreate(ExamBase):
    """Schema para criação de um novo exame."""
    pass


class ExamUpdate(ExamBase):
    """Schema para atualização de um exame existente."""
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class Exam(ExamBase):
    """Schema para representação completa de um exame, incluindo metadados e questões."""
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    questions: List[Question] = []

    class Config:
        from_attributes = True