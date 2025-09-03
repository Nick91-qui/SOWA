from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Prova(Base):
    __tablename__ = "provas"

    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, nullable=True)
    prazo_final = Column(DateTime, nullable=False)
    tempo_limite = Column(Integer, default=50, nullable=False)
    criado_em = Column(DateTime, server_default=func.now())

    professor = relationship("Usuario")

class ProvaTurma(Base):
    __tablename__ = "provas_turmas"

    id = Column(Integer, primary_key=True, index=True)
    prova_id = Column(Integer, ForeignKey("provas.id"), nullable=False)
    turma_id = Column(Integer, ForeignKey("turmas.id"), nullable=False)

    prova = relationship("Prova")
    turma = relationship("Turma")

class Questao(Base):
    __tablename__ = "questoes"

    id = Column(Integer, primary_key=True, index=True)
    prova_id = Column(Integer, ForeignKey("provas.id"), nullable=False)
    enunciado = Column(Text, nullable=False)
    alternativas = Column(JSON, nullable=False) # Stores a list of strings
    resposta_correta = Column(Integer, nullable=False) # Index of the correct alternative
    ordem = Column(Integer, nullable=False)

    prova = relationship("Prova")