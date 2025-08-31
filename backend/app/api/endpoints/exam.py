from typing import List
"""Módulo de endpoints da API para gerenciamento de exames e questões.

Contém rotas para criar, ler, atualizar e excluir exames e questões,
com verificação de permissões do usuário.
"""

from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.exam import Exam, ExamCreate, ExamUpdate, Question, QuestionCreate, QuestionUpdate
from app.services import exam as exam_service

# Cria um roteador APIRouter para os endpoints de exame
router = APIRouter()

@router.post("/exams/", response_model=Exam)
def create_exam(
    exam: ExamCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Cria um novo exame.

    Args:
        exam (ExamCreate): Os dados do exame a ser criado.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado (proprietário do exame).

    Returns:
        Exam: O exame recém-criado.
    """
    return exam_service.create_exam(db=db, exam=exam, owner_id=current_user.id)

@router.get("/exams/", response_model=List[Exam])
def read_exams(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> List[Exam]:
    """Retorna uma lista de exames.

    Args:
        skip (int): Número de exames a serem ignorados.
        limit (int): Número máximo de exames a serem retornados.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        List[Exam]: Uma lista de objetos Exam.
    """
    exams = exam_service.get_exams(db, skip=skip, limit=limit)
    return exams

@router.get("/exams/{exam_id}", response_model=Exam)
def read_exam(
    exam_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Exam:
    """Retorna um exame específico pelo ID.

    Args:
        exam_id (int): O ID do exame.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Exam: O objeto Exam correspondente.

    Raises:
        HTTPException: Se o exame não for encontrado ou o usuário não tiver permissão.
    """
    exam = exam_service.get_exam(db, exam_id=exam_id)
    if not exam or exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")
    return exam

@router.put("/exams/{exam_id}", response_model=Exam)
def update_exam(
    exam_id: int,
    exam: ExamUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Exam:
    """Atualiza um exame existente.

    Args:
        exam_id (int): O ID do exame a ser atualizado.
        exam (ExamUpdate): Os dados de atualização do exame.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Exam: O exame atualizado.

    Raises:
        HTTPException: Se o exame não for encontrado ou o usuário não tiver permissão.
    """
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found or you don't have permission")
    return exam_service.update_exam(db=db, exam_id=exam_id, exam=exam)

@router.delete("/exams/{exam_id}", response_model=Exam)
def delete_exam(
    exam_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Exam:
    """Exclui um exame existente.

    Args:
        exam_id (int): O ID do exame a ser excluído.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Exam: O exame excluído.

    Raises:
        HTTPException: Se o exame não for encontrado ou o usuário não tiver permissão.
    """
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found or you don't have permission")
    return exam_service.delete_exam(db=db, exam_id=exam_id)

@router.post("/exams/{exam_id}/questions/", response_model=Question)
def create_question_for_exam(
    exam_id: int,
    question: QuestionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Question:
    """Cria uma nova questão para um exame específico.

    Args:
        exam_id (int): O ID do exame ao qual a questão será adicionada.
        question (QuestionCreate): Os dados da questão a ser criada.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Question: A questão recém-criada.

    Raises:
        HTTPException: Se o exame não for encontrado ou o usuário não tiver permissão.
    """
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found or you don't have permission")
    return exam_service.create_question(db=db, question=question, exam_id=exam_id)

@router.get("/exams/{exam_id}/questions/", response_model=List[Question])
def read_questions_for_exam(
    exam_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> List[Question]:
    """Retorna uma lista de questões para um exame específico.

    Args:
        exam_id (int): O ID do exame.
        skip (int): Número de questões a serem ignoradas.
        limit (int): Número máximo de questões a serem retornadas.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        List[Question]: Uma lista de objetos Question.

    Raises:
        HTTPException: Se o exame não for encontrado ou o usuário não tiver permissão.
    """
    db_exam = exam_service.get_exam(db, exam_id=exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found or you don't have permission")
    questions = exam_service.get_questions_by_exam(db, exam_id=exam_id, skip=skip, limit=limit)
    return questions

@router.get("/questions/{question_id}", response_model=Question)
def read_question(
    question_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Question:
    """Retorna uma questão específica pelo ID.

    Args:
        question_id (int): O ID da questão.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Question: O objeto Question correspondente.

    Raises:
        HTTPException: Se a questão não for encontrada ou o usuário não tiver permissão.
    """
    question = exam_service.get_question(db, question_id=question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    db_exam = exam_service.get_exam(db, exam_id=question.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You don't have permission to view this question")
    return question

@router.put("/questions/{question_id}", response_model=Question)
def update_question(
    question_id: int,
    question: QuestionUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Question:
    """Atualiza uma questão existente.

    Args:
        question_id (int): O ID da questão a ser atualizada.
        question (QuestionUpdate): Os dados de atualização da questão.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Question: A questão atualizada.

    Raises:
        HTTPException: Se a questão não for encontrada ou o usuário não tiver permissão.
    """
    db_question = exam_service.get_question(db, question_id=question_id)
    if not db_question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    db_exam = exam_service.get_exam(db, exam_id=db_question.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You don't have permission to update this question")
    return exam_service.update_question(db=db, question_id=question_id, question=question)

@router.delete("/questions/{question_id}", response_model=Question)
def delete_question(
    question_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Question:
    """Exclui uma questão existente.

    Args:
        question_id (int): O ID da questão a ser excluída.
        db (Session): A sessão do banco de dados.
        current_user (User): O usuário autenticado.

    Returns:
        Question: A questão excluída.

    Raises:
        HTTPException: Se a questão não for encontrada ou o usuário não tiver permissão.
    """
    db_question = exam_service.get_question(db, question_id=question_id)
    if not db_question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    db_exam = exam_service.get_exam(db, exam_id=db_question.exam_id)
    if not db_exam or db_exam.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You don't have permission to delete this question")
    return exam_service.delete_question(db=db, question_id=question_id)