from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Turma, AlunoTurma, Usuario
from ..schemas import turma as schemas
from ..utils.dependencies import get_current_professor, get_current_aluno

router = APIRouter()

@router.post("/", response_model=schemas.Turma)
def create_turma(
    turma: schemas.TurmaCreate,
    db: Session = Depends(get_db),
    professor: Usuario = Depends(get_current_professor)
):
    """Cria uma nova turma (apenas para professores)"""
    db_turma = Turma(
        nome=turma.nome,
        codigo=turma.codigo,
        professor_id=professor.id
    )
    db.add(db_turma)
    db.commit()
    db.refresh(db_turma)
    return db_turma

@router.get("/", response_model=list[schemas.Turma])
def list_turmas(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_professor)
):
    """Lista todas as turmas do professor"""
    return db.query(Turma).filter(Turma.professor_id == usuario.id).all()

@router.post("/entrar", response_model=schemas.AlunoTurma)
def entrar_turma(
    turma_data: schemas.AlunoTurmaCreate,
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Permite que um aluno entre em uma turma usando o código"""
    turma = db.query(Turma).filter(Turma.codigo == turma_data.codigo_turma).first()
    if not turma:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    # Verifica se o aluno já está na turma
    existing = db.query(AlunoTurma).filter(
        AlunoTurma.aluno_id == aluno.id,
        AlunoTurma.turma_id == turma.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Aluno já está nesta turma")
    
    aluno_turma = AlunoTurma(aluno_id=aluno.id, turma_id=turma.id)
    db.add(aluno_turma)
    db.commit()
    db.refresh(aluno_turma)
    return aluno_turma

@router.get("/minhas-turmas", response_model=list[schemas.Turma])
def minhas_turmas(
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Lista todas as turmas que o aluno participa"""
    turmas = db.query(Turma).join(AlunoTurma).filter(AlunoTurma.aluno_id == aluno.id).all()
    return turmas