"""Módulo de serviços para operações relacionadas a exames e questões."""

from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.exam import Exam, Question
from app.schemas.exam import ExamCreate, ExamUpdate, QuestionCreate, QuestionUpdate


def get_exam(db: Session, exam_id: int):
    """Obtém um exame pelo seu ID.

    Args:
        db (Session): A sessão do banco de dados.
        exam_id (int): O ID do exame a ser recuperado.

    Returns:
        Exam: O objeto Exam correspondente ao ID, ou None se não encontrado.
    """
    return db.query(Exam).filter(Exam.id == exam_id).first()


def get_exams(db: Session, skip: int = 0, limit: int = 100):
    """Obtém uma lista de exames.

    Args:
        db (Session): A sessão do banco de dados.
        skip (int): O número de registros a serem ignorados.
        limit (int): O número máximo de registros a serem retornados.

    Returns:
        List[Exam]: Uma lista de objetos Exam.
    """
    return db.query(Exam).offset(skip).limit(limit).all()


def create_exam(db: Session, exam: ExamCreate, owner_id: int):
    """Cria um novo exame no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        exam (ExamCreate): Os dados do exame a serem criados.
        owner_id (int): O ID do proprietário do exame.

    Returns:
        Exam: O objeto Exam recém-criado.
    """
    db_exam = Exam(**exam.dict(), owner_id=owner_id)
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam


def update_exam(db: Session, exam_id: int, exam: ExamUpdate):
    """Atualiza um exame existente no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        exam_id (int): O ID do exame a ser atualizado.
        exam (ExamUpdate): Os dados para atualização do exame.

    Returns:
        Exam: O objeto Exam atualizado, ou None se o exame não for encontrado.
    """
    db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if db_exam:
        for key, value in exam.dict(exclude_unset=True).items():
            setattr(db_exam, key, value)
        db.add(db_exam)
        db.commit()
        db.refresh(db_exam)
    return db_exam


def delete_exam(db: Session, exam_id: int):
    """Deleta um exame do banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        exam_id (int): O ID do exame a ser deletado.

    Returns:
        Exam: O objeto Exam deletado, ou None se o exame não for encontrado.
    """
    db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if db_exam:
        db.delete(db_exam)
        db.commit()
    return db_exam


def get_question(db: Session, question_id: int):
    """Obtém uma questão pelo seu ID.

    Args:
        db (Session): A sessão do banco de dados.
        question_id (int): O ID da questão a ser recuperada.

    Returns:
        Question: O objeto Question correspondente ao ID, ou None se não encontrado.
    """
    return db.query(Question).filter(Question.id == question_id).first()


def get_questions_by_exam(db: Session, exam_id: int, skip: int = 0, limit: int = 100):
    """Obtém uma lista de questões para um exame específico.

    Args:
        db (Session): A sessão do banco de dados.
        exam_id (int): O ID do exame ao qual as questões pertencem.
        skip (int): O número de registros a serem ignorados.
        limit (int): O número máximo de registros a serem retornados.

    Returns:
        List[Question]: Uma lista de objetos Question.
    """
    return db.query(Question).filter(Question.exam_id == exam_id).offset(skip).limit(limit).all()


def create_question(db: Session, question: QuestionCreate, exam_id: int):
    """Cria uma nova questão para um exame no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        question (QuestionCreate): Os dados da questão a serem criados.
        exam_id (int): O ID do exame ao qual a questão pertence.

    Returns:
        Question: O objeto Question recém-criado.
    """
    db_question = Question(**question.dict(), exam_id=exam_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def update_question(db: Session, question_id: int, question: QuestionUpdate):
    """Atualiza uma questão existente no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        question_id (int): O ID da questão a ser atualizada.
        question (QuestionUpdate): Os dados para atualização da questão.

    Returns:
        Question: O objeto Question atualizado, ou None se a questão não for encontrada.
    """
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        for key, value in question.dict(exclude_unset=True).items():
            setattr(db_question, key, value)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
    return db_question


def delete_question(db: Session, question_id: int):
    """Deleta uma questão do banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        question_id (int): O ID da questão a ser deletada.

    Returns:
        Question: O objeto Question deletado, ou None se a questão não for encontrada.
    """
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if db_question:
        db.delete(db_question)
        db.commit()
    return db_question