from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class Prova(Base):
    __tablename__ = "provas"

    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(Integer, ForeignKey("usuarios.id"))
    titulo = Column(String, index=True)
    descricao = Column(Text)
    prazo_final = Column(DateTime(timezone=True))
    tempo_limite = Column(Integer, default=50)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    professor = relationship("Usuario", back_populates="provas_criadas")
    questoes = relationship("Questao", back_populates="prova")
    provas_turmas = relationship("ProvaTurma", back_populates="prova")
    tentativas = relationship("Tentativa", back_populates="prova")

class Questao(Base):
    __tablename__ = "questoes"

    id = Column(Integer, primary_key=True, index=True)
    prova_id = Column(Integer, ForeignKey("provas.id"))
    enunciado = Column(Text)
    alternativas = Column(JSON)
    resposta_correta = Column(Integer)
    ordem = Column(Integer)

    prova = relationship("Prova", back_populates="questoes")

class ProvaTurma(Base):
    __tablename__ = "provas_turmas"

    id = Column(Integer, primary_key=True, index=True)
    prova_id = Column(Integer, ForeignKey("provas.id"))
    turma_id = Column(Integer, ForeignKey("turmas.id"))

    prova = relationship("Prova", back_populates="provas_turmas")
    turma = relationship("Turma", back_populates="provas_turmas")