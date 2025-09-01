from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class TentativaBase(BaseModel):
    aluno_id: int
    prova_id: int

class TentativaCreate(BaseModel):
    prova_id: int
    respostas: Dict[str, Any]

class Tentativa(TentativaBase):
    id: int
    iniciado_em: datetime
    finalizado_em: Optional[datetime] = None
    respostas: Dict[str, Any]
    nota: Optional[float] = None
    feedback_liberado: bool

    class Config:
        from_attributes = True