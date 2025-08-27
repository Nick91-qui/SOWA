# backend/app/schemas/fraud_log.py

from datetime import datetime
from pydantic import BaseModel

class FraudLogBase(BaseModel):
    user_id: int
    event_type: str
    details: str | None = None

class FraudLogCreate(FraudLogBase):
    pass

class FraudLog(FraudLogBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True