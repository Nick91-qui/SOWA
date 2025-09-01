from typing import List, Optional
from datetime import datetime
"""Módulo para gerenciar as sessões de exames na API.

Este módulo define as rotas da API para operações relacionadas a sessões de exames,
incluindo criação, leitura, atualização, submissão de respostas e avaliação de sessões.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.exam_session import ExamSession, ExamSessionCreate, ExamSessionUpdate, ExamResponse, ExamResponseCreate
from app.services import exam_session as exam_session_service
from app.services import exam as exam_service
from app.services.score_calculator import calculate_exam_score

# Cria uma instância do APIRouter para definir as rotas da API.
router = APIRouter()

@router.post("/exam-sessions/", response_model=ExamSession, status_code=status.HTTP_201_CREATED)
def create_exam_session(
    exam_session: ExamSessionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Cria uma nova sessão de exame para o usuário atual.

    Verifica se o exame existe e se o usuário já possui uma sessão ativa para o exame.

    Args:
        exam_session (ExamSessionCreate): Os dados para criar a sessão de exame.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Raises:
        HTTPException: Se o exame não for encontrado (404).
        HTTPException: Se o usuário já tiver uma sessão ativa para o exame (400).

    Returns:
        ExamSession: A sessão de exame recém-criada.
    """
    db_exam = exam_service.get_exam(db, exam_id=exam_session.exam_id)
    if not db_exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")
    
    # Verifica se o usuário já possui uma sessão ativa para este exame.
    existing_session = db.query(ExamSession).filter(
        ExamSession.exam_id == exam_session.exam_id,
        ExamSession.user_id == current_user.id,
        ExamSession.is_active == True
    ).first()
    if existing_session:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already has an active session for this exam")

    return exam_session_service.create_exam_session(db=db, exam_session=exam_session, user_id=current_user.id)

@router.get("/exam-sessions/me/", response_model=List[ExamSession])
def read_my_exam_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Retorna todas as sessões de exame do usuário atual.

    Args:
        skip (int): O número de sessões a pular (para paginação).
        limit (int): O número máximo de sessões a retornar (para paginação).
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Returns:
        List[ExamSession]: Uma lista das sessões de exame do usuário.
    """
    sessions = exam_session_service.get_exam_sessions_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return sessions

@router.get("/exam-sessions/{session_id}", response_model=ExamSession)
def read_exam_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Retorna uma sessão de exame específica pelo ID.

    Verifica se a sessão existe e se o usuário atual tem permissão para acessá-la.

    Args:
        session_id (int): O ID da sessão de exame.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Raises:
        HTTPException: Se a sessão não for encontrada ou o usuário não tiver permissão (404).

    Returns:
        ExamSession: A sessão de exame solicitada.
    """
    session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found or you don't have permission")
    return session

@router.put("/exam-sessions/{session_id}", response_model=ExamSession)
def update_exam_session(
    session_id: int,
    session_update: ExamSessionUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Atualiza uma sessão de exame existente.

    Verifica se a sessão existe e se o usuário atual tem permissão para modificá-la.

    Args:
        session_id (int): O ID da sessão de exame a ser atualizada.
        session_update (ExamSessionUpdate): Os dados para atualizar a sessão de exame.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Raises:
        HTTPException: Se a sessão não for encontrada ou o usuário não tiver permissão (404).

    Returns:
        ExamSession: A sessão de exame atualizada.
    """
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session or db_session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found or you don't have permission")
    return exam_session_service.update_exam_session(db=db, session_id=session_id, session_update=session_update)

@router.post("/exam-sessions/{session_id}/responses/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam_response(
    session_id: int,
    response: ExamResponseCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Cria uma nova resposta para uma questão dentro de uma sessão de exame.

    Verifica se a sessão existe, se o usuário tem permissão e se a sessão está em andamento.
    Opcionalmente, valida se a questão pertence ao exame da sessão.

    Args:
        session_id (int): O ID da sessão de exame.
        response (ExamResponseCreate): Os dados da resposta a ser criada.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Raises:
        HTTPException: Se a sessão não for encontrada ou o usuário não tiver permissão (404).
        HTTPException: Se a sessão não estiver em progresso (400).
        HTTPException: Se a questão não pertencer à sessão de exame (400).

    Returns:
        ExamResponse: A resposta de exame recém-criada.
    """
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session or db_session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found or you don't have permission")
    if db_session.status != "in_progress":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Exam session is not in progress")

    # Atualiza o status da sessão para 'submitted' e define o end_time
    db_session.status = "submitted"
    db_session.end_time = datetime.utcnow()
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    # Calcula a pontuação do exame
    calculated_score = calculate_exam_score(db, session_id=session_id)
    db_session.score = calculated_score
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    return db_session

@router.post("/exam-sessions/{session_id}/auto-submit/", response_model=ExamSession)
def auto_submit_exam_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
):
    """Submete automaticamente uma sessão de exame devido a violações.

    Esta rota não requer autenticação de usuário, mas valida a existência da sessão.

    Args:
        session_id (int): O ID da sessão de exame a ser submetida.
        db (Session): A sessão do banco de dados.

    Raises:
        HTTPException: Se a sessão não for encontrada (404).
        HTTPException: Se a sessão não estiver em progresso (400).

    Returns:
        ExamSession: A sessão de exame atualizada após a submissão.
    """
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found")
    if db_session.status != "in_progress":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Exam session is not in progress")

    # Atualiza o status da sessão para 'submitted' e define o end_time
    db_session.status = "submitted"
    db_session.end_time = datetime.utcnow()
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    # Calcula a pontuação do exame
    calculated_score = calculate_exam_score(db, session_id=session_id)
    db_session.score = calculated_score
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    return db_session
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot submit responses to a session that is not in progress")
    
    # Valida se a questão pertence ao exame da sessão.
    question = exam_service.get_question(db, question_id=response.question_id)
    if not question or question.exam_id != db_session.exam_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Question does not belong to this exam session")

    return exam_session_service.create_exam_response(db=db, response=response, session_id=session_id)

@router.post("/exam-sessions/{session_id}/submit/", response_model=ExamSession)
def submit_exam_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Submete uma sessão de exame, marcando-a como concluída.

    Verifica se a sessão existe, se o usuário tem permissão e se a sessão está em progresso.

    Args:
        session_id (int): O ID da sessão de exame a ser submetida.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Raises:
        HTTPException: Se a sessão não for encontrada ou o usuário não tiver permissão (404).
        HTTPException: Se a sessão não estiver em progresso (400).

    Returns:
        ExamSession: A sessão de exame atualizada após a submissão.
    """
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session or db_session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found or you don't have permission")
    if db_session.status != "in_progress":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Exam session is not in progress")

    updated_session = exam_session_service.update_exam_session(
        db=db,
        session_id=session_id,
        session_update=ExamSessionUpdate(status="submitted", end_time=datetime.now())
    )

    calculate_exam_score(db, updated_session)

    return updated_session

@router.post("/exam-sessions/{session_id}/grade/", response_model=ExamSession)
def grade_exam_session_api(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Avalia uma sessão de exame.

    Verifica se a sessão existe e se o usuário atual (proprietário do exame ou admin) tem permissão para avaliá-la.
    Não permite a avaliação de sessões que ainda estão em progresso.

    Args:
        session_id (int): O ID da sessão de exame a ser avaliada.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado atualmente.

    Raises:
        HTTPException: Se a sessão não for encontrada (404).
        HTTPException: Se o usuário não tiver permissão para avaliar (403).
        HTTPException: Se a sessão ainda estiver em progresso (400).

    Returns:
        ExamSession: A sessão de exame atualizada com a nota.
    """
    db_session = exam_session_service.get_exam_session(db, session_id=session_id)
    if not db_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found")
    
    # Apenas o proprietário do exame ou um administrador deve ser capaz de avaliar.
    db_exam = exam_service.get_exam(db, exam_id=db_session.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id: # Necessita de gerenciamento de papéis adequado.
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to grade this exam session")

    if db_session.status == "in_progress":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot grade an exam session that is still in progress")

    return exam_session_service.grade_exam_session(db=db, session_id=session_id)