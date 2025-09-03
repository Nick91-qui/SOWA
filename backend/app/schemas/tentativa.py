from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class TentativaBase(BaseModel):
    aluno_id: int
    prova_id: int

class TentativaCreate(TentativaBase):
    pass

class TentativaResposta(BaseModel):
    respostas: Dict[int, int] # question_id: selected_alternative_index

class Tentativa(TentativaBase):
    id: int
    iniciado_em: datetime
    finalizado_em: Optional[datetime] = None
    respostas: Optional[Dict[int, int]] = None
    nota: Optional[float] = None
    feedback_liberado: bool = False

    class Config:
        orm_mode = True