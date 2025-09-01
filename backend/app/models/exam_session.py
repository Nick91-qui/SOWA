from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON
"""Módulo que define os modelos de banco de dados para Sessões de Exame e Respostas de Exame.

Este módulo contém as definições das tabelas `exam_sessions` e `exam_responses`,
utilizando SQLAlchemy ORM para mapeamento de objetos-relacional.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ExamSession(Base):
    """Modelo de banco de dados para uma Sessão de Exame.

    Atributos:
        id (int): Identificador único da sessão de exame (chave primária).
        exam_id (int): ID do exame ao qual esta sessão pertence (chave estrangeira para `exams.id`).
        user_id (int): ID do usuário que iniciou esta sessão (chave estrangeira para `users.id`).
        start_time (datetime): Carimbo de data/hora de início da sessão.
        end_time (datetime, optional): Carimbo de data/hora de término da sessão.
        is_active (bool): Indica se a sessão está ativa (padrão: True).
        status (str): Status atual da sessão (ex: 'in_progress', 'submitted', 'graded').

        exam (Exam): Relacionamento com o modelo `Exam` associado a esta sessão.
        user (User): Relacionamento com o modelo `User` que é o proprietário desta sessão.
        responses (List[ExamResponse]): Relacionamento com as respostas enviadas nesta sessão.
    """
    __tablename__ = "exam_sessions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    status = Column(String, default="in_progress")  # in_progress, submitted, graded
    score = Column(Float, nullable=True) # Pontuação final da sessão de exame
    
    # Relacionamento com o exame associado a esta sessão.
    exam = relationship("Exam", backref="sessions")
    # Relacionamento com o usuário que iniciou esta sessão.
    user = relationship("User", backref="exam_sessions")
    # Relacionamento com as respostas enviadas nesta sessão, com exclusão em cascata.
    responses = relationship("ExamResponse", back_populates="session", cascade="all, delete-orphan")


class ExamResponse(Base):
    """Modelo de banco de dados para uma Resposta de Exame.

    Atributos:
        id (int): Identificador único da resposta (chave primária).
        session_id (int): ID da sessão de exame à qual esta resposta pertence (chave estrangeira para `exam_sessions.id`).
        question_id (int): ID da questão à qual esta resposta se refere (chave estrangeira para `questions.id`).
        answer (JSON): O conteúdo da resposta (pode ser texto, opções selecionadas, etc.).
        is_correct (bool, optional): Indica se a resposta está correta (pode ser nulo até a avaliação).
        points_earned (int, optional): Pontos ganhos por esta resposta (pode ser nulo até a avaliação).
        timestamp (datetime): Carimbo de data/hora em que a resposta foi registrada.

        session (ExamSession): Relacionamento com o modelo `ExamSession` ao qual esta resposta pertence.
        question (Question): Relacionamento com o modelo `Question` ao qual esta resposta se refere.
    """
    __tablename__ = "exam_responses"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(JSON)  # Pode armazenar diferentes tipos de respostas (texto, opções selecionadas, etc.)
    is_correct = Column(Boolean, nullable=True)
    points_earned = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamento com a sessão de exame à qual esta resposta pertence.
    session = relationship("ExamSession", back_populates="responses")
    # Relacionamento com a questão à qual esta resposta se refere.
    question = relationship("Question")