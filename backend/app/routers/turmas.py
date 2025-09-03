from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import secrets

from .. import schemas, models
from ..database import get_db
from ..utils.dependencies import get_current_user, get_current_active_professor, get_current_active_aluno

router = APIRouter(
    prefix="/turmas",
    tags=["Turmas"]
)

@router.post("/", response_model=schemas.Turma)
def create_turma(turma: schemas.TurmaCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    code = "".join(secrets.choice("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ") for i in range(6))
    db_turma = models.Turma(**turma.dict(), professor_id=current_user.id, codigo=code)
    db.add(db_turma)
    db.commit()
    db.refresh(db_turma)
    return db_turma

@router.get("/professor", response_model=List[schemas.Turma])
def get_professor_turmas(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    return db.query(models.Turma).filter(models.Turma.professor_id == current_user.id).all()

@router.post("/entrar", response_model=schemas.AlunoTurma)
def join_turma(codigo: str, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_aluno)):
    db_turma = db.query(models.Turma).filter(models.Turma.codigo == codigo).first()
    if not db_turma:
        raise HTTPException(status_code=404, detail="Turma not found")
    
    db_aluno_turma = db.query(models.AlunoTurma).filter(
        models.AlunoTurma.aluno_id == current_user.id,
        models.AlunoTurma.turma_id == db_turma.id
    ).first()
    if db_aluno_turma:
        raise HTTPException(status_code=400, detail="Aluno already in this turma")
    
    new_aluno_turma = models.AlunoTurma(aluno_id=current_user.id, turma_id=db_turma.id)
    db.add(new_aluno_turma)
    db.commit()
    db.refresh(new_aluno_turma)
    return new_aluno_turma

@router.get("/aluno", response_model=List[schemas.Turma])
def get_aluno_turmas(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_aluno)):
    turmas_ids = [at.turma_id for at in db.query(models.AlunoTurma).filter(models.AlunoTurma.aluno_id == current_user.id).all()]
    return db.query(models.Turma).filter(models.Turma.id.in_(turmas_ids)).all()

@router.delete("/{turma_id}/remover_aluno/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_aluno_from_turma(turma_id: int, aluno_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    db_turma = db.query(models.Turma).filter(models.Turma.id == turma_id, models.Turma.professor_id == current_user.id).first()
    if not db_turma:
        raise HTTPException(status_code=404, detail="Turma not found or not owned by professor")
    
    db_aluno_turma = db.query(models.AlunoTurma).filter(
        models.AlunoTurma.aluno_id == aluno_id,
        models.AlunoTurma.turma_id == turma_id
    ).first()
    if not db_aluno_turma:
        raise HTTPException(status_code=404, detail="Aluno not found in this turma")
    
    db.delete(db_aluno_turma)
    db.commit()
    return {"ok": True}

@router.delete("/sair/{turma_id}", status_code=status.HTTP_204_NO_CONTENT)
def leave_turma(turma_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_aluno)):
    db_aluno_turma = db.query(models.AlunoTurma).filter(
        models.AlunoTurma.aluno_id == current_user.id,
        models.AlunoTurma.turma_id == turma_id
    ).first()
    if not db_aluno_turma:
        raise HTTPException(status_code=404, detail="Aluno not found in this turma")
    
    db.delete(db_aluno_turma)
    db.commit()
    return {"ok": True}