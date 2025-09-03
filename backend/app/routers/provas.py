from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, models
from ..database import get_db
from ..utils.dependencies import get_current_user, get_current_active_professor, get_current_active_aluno

router = APIRouter(
    prefix="/provas",
    tags=["Provas"]
)

@router.post("/", response_model=schemas.Prova)
def create_prova(prova: schemas.ProvaCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    db_prova = models.Prova(
        titulo=prova.titulo,
        descricao=prova.descricao,
        prazo_final=prova.prazo_final,
        tempo_limite=prova.tempo_limite,
        professor_id=current_user.id
    )
    db.add(db_prova)
    db.commit()
    db.refresh(db_prova)

    for questao_data in prova.questoes:
        db_questao = models.Questao(
            prova_id=db_prova.id,
            enunciado=questao_data.enunciado,
            alternativas=questao_data.alternativas,
            resposta_correta=questao_data.resposta_correta,
            ordem=questao_data.ordem
        )
        db.add(db_questao)
    
    for turma_id in prova.turmas_ids:
        db_prova_turma = models.ProvaTurma(
            prova_id=db_prova.id,
            turma_id=turma_id
        )
        db.add(db_prova_turma)
    
    db.commit()
    db.refresh(db_prova)
    return db_prova

@router.get("/professor", response_model=List[schemas.Prova])
def get_professor_provas(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_professor)):
    return db.query(models.Prova).filter(models.Prova.professor_id == current_user.id).all()

@router.get("/aluno", response_model=List[schemas.Prova])
def get_aluno_provas(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_active_aluno)):
    turmas_ids = [at.turma_id for at in db.query(models.AlunoTurma).filter(models.AlunoTurma.aluno_id == current_user.id).all()]
    provas_ids = [pt.prova_id for pt in db.query(models.ProvaTurma).filter(models.ProvaTurma.turma_id.in_(turmas_ids)).all()]
    return db.query(models.Prova).filter(models.Prova.id.in_(provas_ids)).all()

@router.get("/{prova_id}", response_model=schemas.Prova)
def get_prova(prova_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    db_prova = db.query(models.Prova).filter(models.Prova.id == prova_id).first()
    if not db_prova:
        raise HTTPException(status_code=404, detail="Prova not found")
    
    # Check if user has access to this prova (either professor created it or student is in a linked turma)
    if current_user.tipo == models.TipoUsuario.professor and db_prova.professor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this prova")
    
    if current_user.tipo == models.TipoUsuario.aluno:
        turmas_ids = [at.turma_id for at in db.query(models.AlunoTurma).filter(models.AlunoTurma.aluno_id == current_user.id).all()]
        prova_turmas = db.query(models.ProvaTurma).filter(models.ProvaTurma.prova_id == prova_id, models.ProvaTurma.turma_id.in_(turmas_ids)).first()
        if not prova_turmas:
            raise HTTPException(status_code=403, detail="Not authorized to view this prova")

    db_prova.questoes = db.query(models.Questao).filter(models.Questao.prova_id == prova_id).order_by(models.Questao.ordem).all()
    return db_prova