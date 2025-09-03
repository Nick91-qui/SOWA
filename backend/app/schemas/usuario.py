from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from ..models.usuario import TipoUsuario

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    tipo: TipoUsuario

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioInDB(UsuarioBase):
    id: int
    criado_em: datetime

    class Config:
        orm_mode = True

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str

class TokenData(BaseModel):
    email: Optional[str] = None