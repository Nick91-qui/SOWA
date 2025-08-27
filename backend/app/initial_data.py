# backend/app/initial_data.py

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.models.fraud_log import FraudLog # Import the new model
from app.core.database import SessionLocal, Base, engine

def create_initial_data(db: Session):
    Base.metadata.create_all(bind=engine)

    user = db.query(User).filter(User.email == "admin@example.com").first()
    if not user:
        hashed_password = get_password_hash("admin")
        user = User(email="admin@example.com", hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        print("Initial admin user created")

if __name__ == "__main__":
    db = SessionLocal()
    create_initial_data(db)
    db.close()