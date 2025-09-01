"""Módulo que define o modelo de log de fraude para o banco de dados."""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
from app.models.exam_session import ExamSession


class FraudLog(Base):
    """Modelo de banco de dados para logs de fraude.

    Atributos:
        id (int): Chave primária do log de fraude.
        user_id (int): ID do usuário associado ao log de fraude (chave estrangeira para a tabela 'users').
        event_type (str): Tipo de evento de fraude (ex: 'login_fail', 'exam_tamper').
        timestamp (datetime): Carimbo de data/hora de quando o evento de fraude ocorreu.
        details (str, optional): Detalhes adicionais sobre o evento de fraude.
        user (Relationship): Relacionamento com o modelo User, representando o usuário associado.
    """
    __tablename__ = "fraud_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.id"))
    event_type = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)

    user = relationship("User")
    exam_session = relationship("ExamSession")