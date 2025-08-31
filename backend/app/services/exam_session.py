"""Módulo de serviços para operações relacionadas a sessões de exame e respostas."""

from sqlalchemy.orm import Session
from typing import List, Optional, Any
from datetime import datetime

from app.models.exam import Exam, Question
from app.models.exam_session import ExamSession, ExamResponse
from app.schemas.exam_session import ExamSessionCreate, ExamSessionUpdate, ExamResponseCreate


def create_exam_session(db: Session, exam_session: ExamSessionCreate, user_id: int):
    """Cria uma nova sessão de exame no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        exam_session (ExamSessionCreate): Os dados da sessão de exame a ser criada.
        user_id (int): O ID do usuário que está criando a sessão.

    Returns:
        ExamSession: O objeto ExamSession recém-criado, ou None se o exame não for encontrado.
    """
    db_exam = db.query(Exam).filter(Exam.id == exam_session.exam_id).first()
    if not db_exam:
        return None # Or raise an exception

    db_session = ExamSession(**exam_session.dict(), user_id=user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_exam_session(db: Session, session_id: int):
    """Obtém uma sessão de exame pelo seu ID.

    Args:
        db (Session): A sessão do banco de dados.
        session_id (int): O ID da sessão de exame a ser recuperada.

    Returns:
        ExamSession: O objeto ExamSession correspondente ao ID, ou None se não encontrado.
    """
    return db.query(ExamSession).filter(ExamSession.id == session_id).first()


def get_exam_sessions_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Obtém uma lista de sessões de exame para um usuário específico.

    Args:
        db (Session): A sessão do banco de dados.
        user_id (int): O ID do usuário.
        skip (int): O número de registros a serem ignorados.
        limit (int): O número máximo de registros a serem retornados.

    Returns:
        List[ExamSession]: Uma lista de objetos ExamSession.
    """
    return db.query(ExamSession).filter(ExamSession.user_id == user_id).offset(skip).limit(limit).all()


def update_exam_session(db: Session, session_id: int, session_update: ExamSessionUpdate):
    """Atualiza uma sessão de exame existente no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        session_id (int): O ID da sessão de exame a ser atualizada.
        session_update (ExamSessionUpdate): Os dados para atualização da sessão de exame.

    Returns:
        ExamSession: O objeto ExamSession atualizado, ou None se a sessão não for encontrada.
    """
    db_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if db_session:
        for key, value in session_update.dict(exclude_unset=True).items():
            setattr(db_session, key, value)
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session


def end_exam_session(db: Session, session_id: int):
    """Finaliza uma sessão de exame, definindo o tempo de término e o status como 'submitted'.

    Args:
        db (Session): A sessão do banco de dados.
        session_id (int): O ID da sessão de exame a ser finalizada.

    Returns:
        ExamSession: O objeto ExamSession atualizado, ou None se a sessão não for encontrada.
    """
    db_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if db_session:
        db_session.end_time = datetime.now()
        db_session.status = "submitted"
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session


def create_exam_response(db: Session, response: ExamResponseCreate, session_id: int):
    """Cria uma nova resposta de exame para uma sessão específica.

    Args:
        db (Session): A sessão do banco de dados.
        response (ExamResponseCreate): Os dados da resposta a ser criada.
        session_id (int): O ID da sessão de exame à qual a resposta pertence.

    Returns:
        ExamResponse: O objeto ExamResponse recém-criado.
    """
    db_response = ExamResponse(**response.dict(), session_id=session_id)
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response


def get_exam_responses_by_session(db: Session, session_id: int, skip: int = 0, limit: int = 100):
    """Obtém uma lista de respostas de exame para uma sessão específica.

    Args:
        db (Session): A sessão do banco de dados.
        session_id (int): O ID da sessão de exame.
        skip (int): O número de registros a serem ignorados.
        limit (int): O número máximo de registros a serem retornados.

    Returns:
        List[ExamResponse]: Uma lista de objetos ExamResponse.
    """
    return db.query(ExamResponse).filter(ExamResponse.session_id == session_id).offset(skip).limit(limit).all()


def get_exam_response(db: Session, response_id: int):
    """Obtém uma resposta de exame pelo seu ID.

    Args:
        db (Session): A sessão do banco de dados.
        response_id (int): O ID da resposta de exame a ser recuperada.

    Returns:
        ExamResponse: O objeto ExamResponse correspondente ao ID, ou None se não encontrado.
    """
    return db.query(ExamResponse).filter(ExamResponse.id == response_id).first()


def grade_exam_session(db: Session, session_id: int):
    """Avalia uma sessão de exame, calculando a pontuação com base nas respostas corretas.

    Args:
        db (Session): A sessão do banco de dados.
        session_id (int): O ID da sessão de exame a ser avaliada.

    Returns:
        ExamSession: O objeto ExamSession avaliado, ou None se a sessão não for encontrada.
    """
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