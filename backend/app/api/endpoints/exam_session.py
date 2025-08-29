from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.exam_session import ExamSession, ExamSessionCreate, ExamSessionUpdate, ExamResponse, ExamResponseCreate
from app.services import exam_session as exam_session_service
from app.services import exam as exam_service

router = APIRouter()

@router.post("/exam-sessions/", response_model=ExamSession, status_code=status.HTTP_201_CREATED)
def create_exam_session(
    exam_session: ExamSessionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_exam = exam_service.get_exam(db, exam_id=exam_session.exam_id)
    if not db_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Check if the user already has an active session for this exam
    existing_session = db.query(ExamSession).filter(
        ExamSession.exam_id == exam_session.exam_id,
        ExamSession.user_id == current_user.id,
        ExamSession.is_active == True
    ).first()
    if existing_session:
        raise HTTPException(status_code=400, detail="User already has an active session for this exam")

    return exam_session_service.create_exam_session(db=db, exam_session=exam_session, user_id=current_user.id)

@router.get("/exam-sessions/me/", response_model=List[ExamSession])
def read_my_exam_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    sessions = exam_session_service.get_exam_sessions_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return sessions

@router.get("/exam-sessions/{session_id}", response_model=ExamSession)
def read_exam_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam session not found or you don't have permission")
    return session

@router.put("/exam-sessions/{session_id}", response_model=ExamSession)
def update_exam_session(
    session_id: int,
    session_update: ExamSessionUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session or db_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam session not found or you don't have permission")
    return exam_session_service.update_exam_session(db=db, session_id=session_id, session_update=session_update)

@router.post("/exam-sessions/{session_id}/responses/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam_response(
    session_id: int,
    response: ExamResponseCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session or db_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam session not found or you don't have permission")
    if db_session.status != "in_progress":
        raise HTTPException(status_code=400, detail="Cannot submit responses to a session that is not in progress")
    
    # Optional: Validate question_id against the exam's questions
    question = exam_service.get_question(db, question_id=response.question_id)
    if not question or question.exam_id != db_session.exam_id:
        raise HTTPException(status_code=400, detail="Question does not belong to this exam session")

    return exam_session_service.create_exam_response(db=db, response=response, session_id=session_id)

@router.post("/exam-sessions/{session_id}/submit/", response_model=ExamSession)
def submit_exam_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session or db_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Exam session not found or you don't have permission")
    if db_session.status != "in_progress":
        raise HTTPException(status_code=400, detail="Exam session is not in progress")
    
    return exam_session_service.end_exam_session(db=db, session_id=session_id)

@router.post("/exam-sessions/{session_id}/grade/", response_model=ExamSession)
def grade_exam_session_api(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Exam session not found")
    
    # Only the exam owner or an admin should be able to grade
    db_exam = exam_service.get_exam(db, exam_id=db_session.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id: # Needs proper role management
        raise HTTPException(status_code=403, detail="You don't have permission to grade this exam session")

    if db_session.status == "in_progress":
        raise HTTPException(status_code=400, detail="Cannot grade an exam session that is still in progress")

    return exam_session_service.grade_exam_session(db=db, session_id=session_id)