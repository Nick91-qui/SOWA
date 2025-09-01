# backend/app/initial_data.py

import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.models.fraud_log import FraudLog # Import the new model
from app.models.exam import Exam, Question
from app.models.exam_session import ExamSession, ExamResponse
from app.core.database import SessionLocal, Base, engine

def create_initial_data(db: Session):
    logging.info("Starting initial data creation...")
    Base.metadata.create_all(bind=engine)

    user = db.query(User).filter(User.email == "admin@example.com").first()
    if not user:
        hashed_password = get_password_hash("admin")
        user = User(email="admin@example.com", hashed_password=hashed_password, role="teacher")
        db.add(user)
        db.commit()
        db.refresh(user)
        logging.info("Initial admin user created")
    else:
        logging.info("Admin user already exists.")

    student_user = db.query(User).filter(User.email == "student@example.com").first()
    if not student_user:
        hashed_password = get_password_hash("student")
        student_user = User(email="student@example.com", hashed_password=hashed_password, role="student")
        db.add(student_user)
        db.commit()
        db.refresh(student_user)
        logging.info("Initial student user created")
    else:
        logging.info("Student user already exists.")

    logging.info("Finished initial data creation.")

if __name__ == "__main__":
    db = SessionLocal()
    create_initial_data(db)
    db.close()