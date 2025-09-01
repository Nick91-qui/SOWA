from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class Turma(Base):
    __tablename__ = "turmas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    codigo = Column(String, unique=True, index=True)
    professor_id = Column(Integer, ForeignKey("usuarios.id"))
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    professor = relationship("Usuario", back_populates="turmas_criadas")
    alunos_turmas = relationship("AlunoTurma", back_populates="turma")
    provas_turmas = relationship("ProvaTurma", back_populates="turma")

class AlunoTurma(Base):
    __tablename__ = "alunos_turmas"

    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("usuarios.id"))
    turma_id = Column(Integer, ForeignKey("turmas.id"))
    entrou_em = Column(DateTime(timezone=True), server_default=func.now())

    aluno = relationship("Usuario", back_populates="alunos_turmas")
    turma = relationship("Turma", back_populates="alunos_turmas")