from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .usuario import Usuario
from ..database import Base

class Turma(Base):
    __tablename__ = "turmas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    codigo = Column(String, unique=True, index=True, nullable=False)
    professor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    criado_em = Column(DateTime, server_default=func.now())

    professor = relationship("Usuario")

class AlunoTurma(Base):
    __tablename__ = "alunos_turmas"

    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    turma_id = Column(Integer, ForeignKey("turmas.id"), nullable=False)
    entrou_em = Column(DateTime, server_default=func.now())

    aluno = relationship("Usuario")
    turma = relationship("Turma")