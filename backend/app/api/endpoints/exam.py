from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.exam import Exam, ExamCreate, ExamUpdate, Question, QuestionCreate, QuestionUpdate
from app.services import exam as exam_service

router = APIRouter()

@router.post("/exams/", response_model=Exam)
def create_exam(
    exam: ExamCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    return exam_service.create_exam(db=db, exam=exam, owner_id=current_user.id)

@router.get("/exams/", response_model=List[Exam])
def read_exams(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    exams = exam_service.get_exams(db, skip=skip, limit=limit)
    return exams

@router.get("/exams/{exam_id}", response_model=Exam)
def read_exam(
    exam_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    exam = exam_service.get_exam(db, exam_id=exam_id)
    if not exam or exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.put("/exams/{exam_id}", response_model=Exam)
def update_exam(
    exam_id: int,
    exam: ExamUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam not found or you don't have permission")
    return exam_service.update_exam(db=db, exam_id=exam_id, exam=exam)

@router.delete("/exams/{exam_id}", response_model=Exam)
def delete_exam(
    exam_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam not found or you don't have permission")
    return exam_service.delete_exam(db=db, exam_id=exam_id)

@router.post("/exams/{exam_id}/questions/", response_model=Question)
def create_question_for_exam(
    exam_id: int,
    question: QuestionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam not found or you don't have permission")
    return exam_service.create_question(db=db, question=question, exam_id=exam_id)

@router.get("/exams/{exam_id}/questions/", response_model=List[Question])
def read_questions_for_exam(
    exam_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam not found or you don't have permission")
    questions = exam_service.get_questions_by_exam(db, exam_id=exam_id, skip=skip, limit=limit)
    return questions

@router.get("/questions/{question_id}", response_model=Question)
def read_question(
    question_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    question = exam_service.get_question(db, question_id=question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    db_exam = exam_service.get_exam(db, exam_id=question.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="You don't have permission to view this question")
    return question

@router.put("/questions/{question_id}", response_model=Question)
def update_question(
    question_id: int,
    question: QuestionUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_question = exam_service.get_question(db, question_id=question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db_exam = exam_service.get_exam(db, exam_id=db_question.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="You don't have permission to update this question")
    return exam_service.update_question(db=db, question_id=question_id, question=question)

@router.delete("/questions/{question_id}", response_model=Question)
def delete_question(
    question_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_question = exam_service.get_question(db, question_id=question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db_exam = exam_service.get_exam(db, exam_id=db_question.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="You don't have permission to delete this question")
    return exam_service.delete_question(db=db, question_id=question_id)