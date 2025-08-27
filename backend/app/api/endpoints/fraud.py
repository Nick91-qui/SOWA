# backend/app/api/endpoints/fraud.py

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.fraud_log import FraudLogCreate, FraudLog
from app.models.fraud_log import FraudLog as DBFraudLog
from app.services.fraud import create_fraud_log

router = APIRouter()

@router.post("/", response_model=FraudLog)
def create_fraud_log_endpoint(*, db: Session = Depends(get_db), fraud_log: FraudLogCreate) -> FraudLog:
    db_fraud_log = create_fraud_log(db=db, fraud_log=fraud_log)
    return FraudLog.from_orm(db_fraud_log)