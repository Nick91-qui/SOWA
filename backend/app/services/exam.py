from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.exam import Exam, Question
from app.schemas.exam import ExamCreate, ExamUpdate, QuestionCreate, QuestionUpdate

def get_exam(db: Session, exam_id: int):
    return db.query(Exam).filter(Exam.id == exam_id).first()

def get_exams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Exam).offset(skip).limit(limit).all()

def create_exam(db: Session, exam: ExamCreate, owner_id: int):
    db_exam = Exam(**exam.dict(), owner_id=owner_id)
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

def update_exam(db: Session, exam_id: int, exam: ExamUpdate):
    db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if db_exam:
        for key, value in exam.dict(exclude_unset=True).items():
            setattr(db_exam, key, value)
        db.add(db_exam)
        db.commit()
        db.refresh(db_exam)
    return db_exam

def delete_exam(db: Session, exam_id: int):
    db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if db_exam:
        db.delete(db_exam)
        db.commit()
    return db_exam

def get_question(db: Session, question_id: int):
    return db.query(Question).filter(Question.id == question_id).first()

def get_questions_by_exam(db: Session, exam_id: int, skip: int = 0, limit: int = 100):
    return db.query(Question).filter(Question.exam_id == exam_id).offset(skip).limit(limit).all()

def create_question(db: Session, question: QuestionCreate, exam_id: int):
    db_question = Question(**question.dict(), exam_id=exam_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def update_question(db: Session, question_id: int, question: QuestionUpdate):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        for key, value in question.dict(exclude_unset=True).items():
            setattr(db_question, key, value)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        db.delete(db_question)
        db.commit()
    return db_question