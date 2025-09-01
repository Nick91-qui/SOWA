from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database import get_db
from ..models import Tentativa, Prova, Questao, Usuario
from ..schemas import tentativa as schemas
from ..utils.dependencies import get_current_aluno, get_current_professor

router = APIRouter()

@router.post("/", response_model=schemas.Tentativa)
def iniciar_tentativa(
    tentativa_data: schemas.TentativaCreate,
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Inicia uma nova tentativa de prova para um aluno"""
    prova = db.query(Prova).filter(Prova.id == tentativa_data.prova_id).first()
    if not prova:
        raise HTTPException(status_code=404, detail="Prova não encontrada")
    
    # Verifica se o aluno já tem uma tentativa em andamento para esta prova
    existing_tentativa = db.query(Tentativa).filter(
        Tentativa.aluno_id == aluno.id,
        Tentativa.prova_id == prova.id,
        Tentativa.finalizado_em == None
    ).first()
    
    if existing_tentativa:
        raise HTTPException(status_code=400, detail="Você já tem uma tentativa em andamento para esta prova.")

    db_tentativa = Tentativa(
        aluno_id=aluno.id,
        prova_id=prova.id,
        iniciado_em=datetime.now(),
        respostas={}
    )
    db.add(db_tentativa)
    db.commit()
    db.refresh(db_tentativa)
    return db_tentativa

@router.put("/{tentativa_id}/finalizar", response_model=schemas.Tentativa)
def finalizar_tentativa(
    tentativa_id: int,
    respostas: dict,
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Finaliza uma tentativa de prova e calcula a nota"""
    tentativa = db.query(Tentativa).filter(
        Tentativa.id == tentativa_id,
        Tentativa.aluno_id == aluno.id,
        Tentativa.finalizado_em == None
    ).first()

    if not tentativa:
        raise HTTPException(status_code=404, detail="Tentativa não encontrada ou já finalizada.")
    
    prova = db.query(Prova).filter(Prova.id == tentativa.prova_id).first()
    if not prova:
        raise HTTPException(status_code=404, detail="Prova associada não encontrada.")

    # Verifica tempo limite
    if prova.tempo_limite:
        tempo_decorrido = (datetime.now() - tentativa.iniciado_em).total_seconds() / 60
        if tempo_decorrido > prova.tempo_limite:
            raise HTTPException(status_code=400, detail="Tempo limite para a prova excedido.")

    nota = 0
    questoes = db.query(Questao).filter(Questao.prova_id == prova.id).all()
    
    for questao in questoes:
        if str(questao.id) in respostas and respostas[str(questao.id)] == questao.resposta_correta:
            nota += 1
    
    tentativa.respostas = respostas
    tentativa.nota = nota
    tentativa.finalizado_em = datetime.now()
    db.commit()
    db.refresh(tentativa)
    return tentativa

@router.get("/aluno/minhas-tentativas", response_model=List[schemas.Tentativa])
def get_minhas_tentativas(
    db: Session = Depends(get_db),
    aluno: Usuario = Depends(get_current_aluno)
):
    """Lista todas as tentativas de prova de um aluno"""
    return db.query(Tentativa).filter(Tentativa.aluno_id == aluno.id).all()

@router.get("/professor/provas/{prova_id}/tentativas", response_model=List[schemas.Tentativa])
def get_tentativas_por_prova(
    prova_id: int,
    db: Session = Depends(get_db),
    professor: Usuario = Depends(get_current_professor)
):
    """Lista todas as tentativas para uma prova específica (apenas para professores) """
    prova = db.query(Prova).filter(Prova.id == prova_id, Prova.professor_id == professor.id).first()
    if not prova:
        raise HTTPException(status_code=404, detail="Prova não encontrada ou você não tem permissão.")
    
    return db.query(Tentativa).filter(Tentativa.prova_id == prova_id).all()

@router.get("/professor/tentativas/{tentativa_id}", response_model=schemas.Tentativa)
def get_tentativa_professor(
    tentativa_id: int,
    db: Session = Depends(get_db),
    professor: Usuario = Depends(get_current_professor)
):
    """Obtém uma tentativa específica pelo ID (apenas para professores) """
    tentativa = db.query(Tentativa).filter(Tentativa.id == tentativa_id).first()
    if not tentativa:
        raise HTTPException(status_code=404, detail="Tentativa não encontrada.")
    
    prova = db.query(Prova).filter(Prova.id == tentativa.prova_id, Prova.professor_id == professor.id).first()
    if not prova:
        raise HTTPException(status_code=403, detail="Você não tem permissão para ver esta tentativa.")
    
    return tentativa