# backend/app/models/fraud_log.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class FraudLog(Base):
    __tablename__ = "fraud_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)

    user = relationship("User")