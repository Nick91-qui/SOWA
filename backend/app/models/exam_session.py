from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ExamSession(Base):
    __tablename__ = "exam_sessions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    status = Column(String, default="in_progress")  # in_progress, submitted, graded
    
    exam = relationship("Exam", backref="sessions")
    user = relationship("User", backref="exam_sessions")
    responses = relationship("ExamResponse", back_populates="session", cascade="all, delete-orphan")

class ExamResponse(Base):
    __tablename__ = "exam_responses"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(JSON)  # Can store different types of answers (text, selected options, etc.)
    is_correct = Column(Boolean, nullable=True)
    points_earned = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("ExamSession", back_populates="responses")
    question = relationship("Question")