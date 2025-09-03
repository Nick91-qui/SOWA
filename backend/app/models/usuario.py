from sqlalchemy import Column, Integer, String, DateTime, Enum
from ..database import Base
from sqlalchemy.sql import func
import enum



class TipoUsuario(str, enum.Enum):
    aluno = "aluno"
    professor = "professor"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    tipo = Column(Enum(TipoUsuario), nullable=False)
    criado_em = Column(DateTime, server_default=func.now())