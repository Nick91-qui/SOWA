# backend/app/schemas/user.py

from typing import Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "student"

class User(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        from_attributes = True # Alterado de orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None