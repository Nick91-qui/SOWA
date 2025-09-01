from sqlalchemy import Column, Integer, DateTime, ForeignKey, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class Tentativa(Base):
    __tablename__ = "tentativas"

    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("usuarios.id"))
    prova_id = Column(Integer, ForeignKey("provas.id"))
    iniciado_em = Column(DateTime(timezone=True), server_default=func.now())
    finalizado_em = Column(DateTime(timezone=True), nullable=True)
    respostas = Column(JSON)
    nota = Column(Float, nullable=True)
    feedback_liberado = Column(Boolean, default=False)

    aluno = relationship("Usuario", back_populates="tentativas")
    prova = relationship("Prova", back_populates="tentativas")