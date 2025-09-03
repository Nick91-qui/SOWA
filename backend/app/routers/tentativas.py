from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import schemas, models
from ..database import get_db
from ..utils.dependencies import get_current_active_user, get_current_active_professor, get_current_active_aluno

router = APIRouter(
    prefix="/tentativas",
    tags=["Tentativas"]
)

@router.post("/", response_model=schemas.Tentativa)
def start_tentativa(prova_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_aluno)):
    db_prova = db.query(models.Prova).filter(models.Prova.id == prova_id).first()
    if not db_prova:
        raise HTTPException(status_code=404, detail="Prova not found")
    
    if datetime.now() > db_prova.prazo_final:
        raise HTTPException(status_code=400, detail="Prova has passed its deadline")

    existing_tentativa = db.query(models.Tentativa).filter(
        models.Tentativa.aluno_id == current_user.id,
        models.Tentativa.prova_id == prova_id
    ).first()
    if existing_tentativa and existing_tentativa.finalizado_em:
        raise HTTPException(status_code=400, detail="Você já realizou esta prova.")
    
    if existing_tentativa and not existing_tentativa.finalizado_em:
        return existing_tentativa # Resume existing attempt

    db_tentativa = models.Tentativa(
        aluno_id=current_user.id,
        prova_id=prova_id,
        iniciado_em=datetime.now()
    )
    db.add(db_tentativa)
    db.commit()
    db.refresh(db_tentativa)
    return db_tentativa

@router.delete("/{tentativa_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tentativa(tentativa_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_user)): 
    db_tentativa = db.query(models.Tentativa).filter(models.Tentativa.id == tentativa_id).first()
    if not db_tentativa:
        raise HTTPException(status_code=404, detail="Tentativa not found")
    
    if current_user.tipo == models.TipoUsuario.aluno and db_tentativa.aluno_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this attempt")
    
    if current_user.tipo == models.TipoUsuario.professor:
        db_prova = db.query(models.Prova).filter(models.Prova.id == db_tentativa.prova_id, models.Prova.professor_id == current_user.id).first()
        if not db_prova:
            raise HTTPException(status_code=403, detail="Not authorized to delete this attempt")

    db.delete(db_tentativa)
    db.commit()
    return {"ok": True}

@router.post("/{tentativa_id}/submit", response_model=schemas.Tentativa)
def submit_tentativa(tentativa_id: int, respostas: schemas.TentativaResposta, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_aluno)):
    db_tentativa = db.query(models.Tentativa).filter(
        models.Tentativa.id == tentativa_id,
        models.Tentativa.aluno_id == current_user.id
    ).first()
    if not db_tentativa:
        raise HTTPException(status_code=404, detail="Tentativa not found")
    
    if db_tentativa.finalizado_em:
        raise HTTPException(status_code=400, detail="Tentativa already submitted")
    
    db_prova = db.query(models.Prova).filter(models.Prova.id == db_tentativa.prova_id).first()
    if not db_prova:
        raise HTTPException(status_code=404, detail="Prova not found")

    # Auto-correct and calculate score
    score = 0
    total_questions = 0
    questoes = db.query(models.Questao).filter(models.Questao.prova_id == db_prova.id).all()
    questoes_map = {q.id: q for q in questoes}

    for q_id, aluno_resposta_idx in respostas.respostas.items():
        if q_id in questoes_map:
            total_questions += 1
            if questoes_map[q_id].resposta_correta == aluno_resposta_idx:
                score += 1
    
    db_tentativa.respostas = respostas.respostas
    db_tentativa.nota = (score / total_questions) * 10 if total_questions > 0 else 0 # Score out of 10
    db_tentativa.finalizado_em = datetime.now()
    db.commit()
    db.refresh(db_tentativa)
    return db_tentativa

@router.get("/professor/{prova_id}", response_model=List[schemas.Tentativa])
def get_tentativas_by_prova_professor(prova_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    db_prova = db.query(models.Prova).filter(models.Prova.id == prova_id, models.Prova.professor_id == current_user.id).first()
    if not db_prova:
        raise HTTPException(status_code=404, detail="Prova not found or not owned by professor")
    
    return db.query(models.Tentativa).filter(models.Tentativa.prova_id == prova_id).all()

@router.post("/{tentativa_id}/liberar_feedback", response_model=schemas.Tentativa)
def liberar_feedback(tentativa_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    db_tentativa = db.query(models.Tentativa).filter(models.Tentativa.id == tentativa_id).first()
    if not db_tentativa:
        raise HTTPException(status_code=404, detail="Tentativa not found")
    
    db_prova = db.query(models.Prova).filter(models.Prova.id == db_tentativa.prova_id, models.Prova.professor_id == current_user.id).first()
    if not db_prova:
        raise HTTPException(status_code=403, detail="Not authorized to release feedback for this attempt")
    
    db_tentativa.feedback_liberado = True
    db.commit()
    db.refresh(db_tentativa)
    return db_tentativa

@router.get("/{tentativa_id}", response_model=schemas.Tentativa)
def get_tentativa_by_id(tentativa_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_user)):
    db_tentativa = db.query(models.Tentativa).filter(models.Tentativa.id == tentativa_id).first()
    if not db_tentativa:
        raise HTTPException(status_code=404, detail="Tentativa not found")
    
    if current_user.tipo == models.TipoUsuario.aluno and db_tentativa.aluno_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this attempt")
    
    if current_user.tipo == models.TipoUsuario.professor:
        db_prova = db.query(models.Prova).filter(models.Prova.id == db_tentativa.prova_id, models.Prova.professor_id == current_user.id).first()
        if not db_prova:
            raise HTTPException(status_code=403, detail="Not authorized to view this attempt")

    return db_tentativa