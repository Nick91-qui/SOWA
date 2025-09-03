from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

class QuestaoBase(BaseModel):
    enunciado: str
    alternativas: List[str]
    ordem: int

class QuestaoCreate(QuestaoBase):
    resposta_correta: int

class Questao(QuestaoBase):
    id: int
    prova_id: int

    class Config:
        orm_mode = True

class ProvaBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    prazo_final: datetime
    tempo_limite: Optional[int] = 50

class ProvaCreate(ProvaBase):
    questoes: List[QuestaoCreate]
    turmas_ids: List[int]

class Prova(ProvaBase):
    id: int
    professor_id: int
    criado_em: datetime
    questoes: List[Questao] = []

    class Config:
        orm_mode = True

class ProvaTurmaBase(BaseModel):
    prova_id: int
    turma_id: int

class ProvaTurmaCreate(ProvaTurmaBase):
    pass

class ProvaTurma(ProvaTurmaBase):
    id: int

    class Config:
        orm_mode = True