from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    senha_hash = Column(String)
    tipo = Column(Enum('aluno', 'professor', name='tipo_usuario'), default='aluno')
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    turmas_criadas = relationship("Turma", back_populates="professor")
    alunos_turmas = relationship("AlunoTurma", back_populates="aluno")
    provas_criadas = relationship("Prova", back_populates="professor")
    tentativas = relationship("Tentativa", back_populates="aluno")