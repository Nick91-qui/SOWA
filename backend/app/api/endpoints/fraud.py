# backend/app/api/endpoints/fraud.py

"""Módulo para gerenciar logs de fraude na API.

Este módulo define as rotas da API para operações relacionadas a logs de fraude,
incluindo a criação de novos registros de fraude.
"""

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.fraud_log import FraudLogCreate, FraudLog
from app.models.fraud_log import FraudLog as DBFraudLog
from app.services.fraud import create_fraud_log

# Cria uma instância do APIRouter para definir as rotas da API.
router = APIRouter()

@router.post("/", response_model=FraudLog)
def create_fraud_log_endpoint(*, db: Session = Depends(get_db), fraud_log: FraudLogCreate) -> FraudLog:
    """Cria um novo log de fraude.

    Args:
        db (Session): A sessão do banco de dados.
        fraud_log (FraudLogCreate): Os dados para criar o log de fraude.

    Returns:
        FraudLog: O log de fraude recém-criado.
    """
    db_fraud_log = create_fraud_log(db=db, fraud_log=fraud_log)
    return FraudLog.from_orm(db_fraud_log)