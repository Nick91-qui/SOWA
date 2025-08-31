from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
"""Módulo que define os modelos de banco de dados para Exames e Questões.

Este módulo contém as definições das tabelas `exams` e `questions`,
utilizando SQLAlchemy ORM para mapeamento de objetos-relacional.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Exam(Base):
    """Modelo de banco de dados para um Exame.

    Atributos:
        id (int): Identificador único do exame (chave primária).
        title (str): Título do exame.
        description (str, optional): Descrição detalhada do exame.
        created_at (datetime): Carimbo de data/hora de criação do exame.
        updated_at (datetime): Carimbo de data/hora da última atualização do exame.
        is_active (bool): Indica se o exame está ativo (padrão: True).
        owner_id (int): ID do usuário proprietário do exame (chave estrangeira para `users.id`).

        owner (User): Relacionamento com o modelo `User` que é o proprietário do exame.
        questions (List[Question]): Relacionamento com as questões associadas a este exame.
    """
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relacionamento com o usuário proprietário do exame.
    owner = relationship("User", backref="exams")
    # Relacionamento com as questões do exame, com exclusão em cascata.
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")


class Question(Base):
    """Modelo de banco de dados para uma Questão de Exame.

    Atributos:
        id (int): Identificador único da questão (chave primária).
        exam_id (int): ID do exame ao qual a questão pertence (chave estrangeira para `exams.id`).
        content (str): Conteúdo ou texto da questão.
        question_type (str): Tipo da questão (ex: 'multiple_choice', 'essay').
        options (str, optional): Opções para questões de múltipla escolha (string JSON).
        correct_answer (str, optional): Resposta correta da questão (string JSON ou texto simples).
        points (int): Pontuação atribuída à questão (padrão: 1).
        created_at (datetime): Carimbo de data/hora de criação da questão.
        updated_at (datetime): Carimbo de data/hora da última atualização da questão.

        exam (Exam): Relacionamento com o modelo `Exam` ao qual a questão pertence.
    """
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    content = Column(String)
    question_type = Column(String) # Ex: 'multiple_choice', 'essay'
    options = Column(String, nullable=True) # String JSON para opções de múltipla escolha
    correct_answer = Column(String, nullable=True) # String JSON ou texto simples
    points = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamento com o exame ao qual a questão pertence.
    exam = relationship("Exam", back_populates="questions")