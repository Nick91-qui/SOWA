from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Prova, Questao, ProvaTurma, Usuario
from ..schemas import prova as schemas
from ..utils.dependencies import get_current_professor, get_current_aluno

router = APIRouter()

@router.post("/", response_model=schemas.Prova)
def create_prova(
    prova: schemas.ProvaCreate,
    db: Session = Depends(get_db),
    professor: Usuario = Depends(get_current_professor)
):
    """Cria uma nova prova (apenas para professores)"""
    db_prova = Prova(
        professor_id=professor.id,
        titulo=prova.titulo,
        descricao=prova.descricao,
        prazo_final=prova.prazo_final,
        tempo_limite=prova.tempo_limite
    )
    db.add(db_prova)
    db.commit()
    db.refresh(db_prova)

    for i, questao_data in enumerate(prova.questoes):
        db_questao = Questao(
            prova_id=db_prova.id,
            enunciado=questao_data.enunciado,
            alternativas=questao_data.alternativas,
            resposta_correta=questao_data.resposta_correta,
            ordem=i
        )
        db.add(db_questao)
    
    for turma_id in prova.turmas_ids:
        db_prova_turma = ProvaTurma(
            prova_id=db_prova.id,
            turma_id=turma_id
        )
        db.add(db_prova_turma)

    db.commit()
    db.refresh(db_prova)
    return db_prova

@router.get("/", response_model=List[schemas.Prova])
def list_provas(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_professor)
):
    """Lista todas as provas criadas pelo professor"""
    return db.query(Prova).filter(Prova.professor_id == usuario.id).all()

@router.get("/{prova_id}", response_model=schemas.Prova)
def get_prova(
    prova_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_professor)
):
    """Obtém uma prova específica pelo ID (apenas para professores) """
    prova = db.query(Prova).filter(Prova.id == prova_id, Prova.professor_id == usuario.id).first()
    if not prova:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    return prova

@router.get("/aluno/disponiveis", response_model=List[schemas.Prova])
def list_provas_disponiveis_aluno(
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Lista as provas disponíveis para o aluno"""
    provas = db.query(Prova).join(ProvaTurma).filter(ProvaTurma.turma_id.in_(
        [at.turma_id for at in aluno.turmas_aluno]
    )).all()
    return provas

@router.get("/aluno/{prova_id}", response_model=schemas.Prova)
def get_prova_aluno(
    prova_id: int,
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Obtém uma prova específica para o aluno, verificando se ele tem acesso"""
    prova = db.query(Prova).filter(Prova.id == prova_id).first()
    if not prova:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    # Verifica se o aluno está em alguma das turmas associadas à prova
    has_access = db.query(ProvaTurma).filter(
        ProvaTurma.prova_id == prova_id,
        ProvaTurma.turma_id.in_([at.turma_id for at in aluno.turmas_aluno])
    ).first()

    if not has_access:
        raise HTTPException(status_code=403, detail="Você não tem acesso a esta prova")
    
    return prova