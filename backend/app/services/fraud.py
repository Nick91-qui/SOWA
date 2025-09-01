"""Módulo de serviços para operações relacionadas a logs de fraude."""

from sqlalchemy.orm import Session

from app.models.fraud_log import FraudLog as DBFraudLog
from app.schemas.fraud_log import FraudLogCreate


def create_fraud_log(db: Session, fraud_log: FraudLogCreate) -> DBFraudLog:
    """Cria um novo registro de log de fraude no banco de dados.

    Args:
        db (Session): A sessão do banco de dados.
        fraud_log (FraudLogCreate): Os dados do log de fraude a ser criado.

    Returns:
        DBFraudLog: O objeto FraudLog recém-criado.
    """
    db_fraud_log = DBFraudLog(
        user_id=fraud_log.user_id,
        session_id=fraud_log.session_id,
        event_type=fraud_log.event_type,
        details=fraud_log.details
    )
    db.add(db_fraud_log)
    db.commit()
    db.refresh(db_fraud_log)
    return db_fraud_log