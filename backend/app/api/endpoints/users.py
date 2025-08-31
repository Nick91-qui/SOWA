# backend/app/api/endpoints/users.py

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.core.security import get_password_hash
from app.models.user import User as DBUser
from app.schemas.user import UserCreate, User as UserSchema

router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
    role: Optional[str] = "student", # Adiciona o parâmetro role com valor padrão 'student'
) -> Any:
    """
    Create new user
    """
    user = db.query(DBUser).filter(DBUser.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    hashed_password = get_password_hash(user_in.password)
    user = DBUser(email=user_in.email, hashed_password=hashed_password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserSchema.from_orm(user)

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: DBUser = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user
    """
    return UserSchema.from_orm(current_user)