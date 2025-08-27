from sqlalchemy.orm import Session

from app.models.fraud_log import FraudLog
from app.schemas.fraud_log import FraudLogCreate

def create_fraud_log(db: Session, fraud_log: FraudLogCreate):
    db_fraud_log = FraudLog(**fraud_log.dict())
    db.add(db_fraud_log)
    db.commit()
    db.refresh(db_fraud_log)
    return db_fraud_log