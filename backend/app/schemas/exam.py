from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class QuestionBase(BaseModel):
    content: str
    question_type: str
    options: Optional[str] = None
    correct_answer: Optional[str] = None
    points: int = 1

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(QuestionBase):
    content: Optional[str] = None
    question_type: Optional[str] = None
    points: Optional[int] = None

class Question(QuestionBase):
    id: int
    exam_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    title: str
    description: Optional[str] = None

class ExamCreate(ExamBase):
    pass

class ExamUpdate(ExamBase):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Exam(ExamBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    questions: List[Question] = []

    class Config:
        from_attributes = True