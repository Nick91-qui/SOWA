from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

class QuestaoBase(BaseModel):
    enunciado: str
    alternativas: Dict[str, str]
    ordem: int

class QuestaoCreate(QuestaoBase):
    resposta_correta: int

class Questao(QuestaoBase):
    id: int
    prova_id: int

    class Config:
        from_attributes = True

class ProvaBase(BaseModel):
    titulo: str
    descricao: str
    prazo_final: datetime
    tempo_limite: int = 50

class ProvaCreate(ProvaBase):
    turmas_ids: List[int]
    questoes: List[QuestaoCreate]

class Prova(ProvaBase):
    id: int
    professor_id: int
    criado_em: datetime
    questoes: List[Questao]

    class Config:
        from_attributes = True

class ProvaTurmaBase(BaseModel):
    prova_id: int
    turma_id: int

class ProvaTurma(ProvaTurmaBase):
    id: int

    class Config:
        from_attributes = True