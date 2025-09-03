from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TurmaBase(BaseModel):
    nome: str

class TurmaCreate(TurmaBase):
    pass

class Turma(TurmaBase):
    id: int
    codigo: str
    professor_id: int
    criado_em: datetime

    class Config:
        orm_mode = True

class AlunoTurmaBase(BaseModel):
    aluno_id: int
    turma_id: int

class AlunoTurmaCreate(AlunoTurmaBase):
    pass

class AlunoTurma(AlunoTurmaBase):
    id: int
    entrou_em: datetime

    class Config:
        orm_mode = True