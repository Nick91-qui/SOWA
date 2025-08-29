from sqlalchemy.orm import Session
from typing import List, Optional, Any
from datetime import datetime

from app.models.exam import Exam, Question
from app.models.exam_session import ExamSession, ExamResponse
from app.schemas.exam_session import ExamSessionCreate, ExamSessionUpdate, ExamResponseCreate

def create_exam_session(db: Session, exam_session: ExamSessionCreate, user_id: int):
    db_exam = db.query(Exam).filter(Exam.id == exam_session.exam_id).first()
    if not db_exam:
        return None # Or raise an exception

    db_session = ExamSession(**exam_session.dict(), user_id=user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_exam_session(db: Session, session_id: int):
    return db.query(ExamSession).filter(ExamSession.id == session_id).first()

def get_exam_sessions_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(ExamSession).filter(ExamSession.user_id == user_id).offset(skip).limit(limit).all()

def update_exam_session(db: Session, session_id: int, session_update: ExamSessionUpdate):
    db_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if db_session:
        for key, value in session_update.dict(exclude_unset=True).items():
            setattr(db_session, key, value)
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session

def end_exam_session(db: Session, session_id: int):
    db_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if db_session:
        db_session.end_time = datetime.now()
        db_session.status = "submitted"
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session

def create_exam_response(db: Session, response: ExamResponseCreate, session_id: int):
    db_response = ExamResponse(**response.dict(), session_id=session_id)
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

def get_exam_responses_by_session(db: Session, session_id: int, skip: int = 0, limit: int = 100):
    return db.query(ExamResponse).filter(ExamResponse.session_id == session_id).offset(skip).limit(limit).all()

def get_exam_response(db: Session, response_id: int):
    return db.query(ExamResponse).filter(ExamResponse.id == response_id).first()

# TODO: Implement grading logic here
def grade_exam_session(db: Session, session_id: int):
    db_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if not db_session:
        return None

    total_points = 0
    for response in db_session.responses:
        question = db.query(Question).filter(Question.id == response.question_id).first()
        if question and question.correct_answer == response.answer: # Simple comparison, needs more robust logic
            response.is_correct = True
            response.points_earned = question.points
            total_points += question.points
        else:
            response.is_correct = False
            response.points_earned = 0
        db.add(response)

    db_session.status = "graded"
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session