from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Tentativa(Base):
    __tablename__ = "tentativas"

    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    prova_id = Column(Integer, ForeignKey("provas.id"), nullable=False)
    iniciado_em = Column(DateTime, server_default=func.now())
    finalizado_em = Column(DateTime, nullable=True)
    respostas = Column(JSON, nullable=True) # Stores a dictionary of question_id: answer_index
    nota = Column(Float, nullable=True)
    feedback_liberado = Column(Boolean, default=False, nullable=False)

    aluno = relationship("Usuario")
    prova = relationship("Prova")