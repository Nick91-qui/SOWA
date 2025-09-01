"""Módulo que define os schemas Pydantic para logs de fraude."""

from datetime import datetime
from pydantic import BaseModel


class FraudLogBase(BaseModel):
    """Schema base para um log de fraude."""
    user_id: int | None = None
    session_id: int
    event_type: str
    details: str | None = None


class FraudLogCreate(FraudLogBase):
    """Schema para criação de um novo log de fraude."""
    pass


class FraudLog(FraudLogBase):
    """Schema para representação completa de um log de fraude, incluindo metadados."""
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True