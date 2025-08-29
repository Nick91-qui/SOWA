from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel

class ExamResponseBase(BaseModel):
    question_id: int
    answer: Any

class ExamResponseCreate(ExamResponseBase):
    pass

class ExamResponse(ExamResponseBase):
    id: int
    session_id: int
    is_correct: Optional[bool] = None
    points_earned: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class ExamSessionBase(BaseModel):
    exam_id: int

class ExamSessionCreate(ExamSessionBase):
    pass

class ExamSessionUpdate(BaseModel):
    is_active: Optional[bool] = None
    status: Optional[str] = None
    end_time: Optional[datetime] = None

class ExamSession(ExamSessionBase):
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    is_active: bool
    status: str
    responses: List[ExamResponse] = []

    class Config:
        from_attributes = True