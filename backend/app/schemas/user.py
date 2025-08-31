# backend/app/schemas/user.py

"""Módulo de esquemas Pydantic para usuários.

Define os modelos de dados para validação e serialização de usuários,
criação de usuários, tokens de autenticação e dados de token.
"""

from typing import Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    """Esquema base para usuários.

    Atributos:
        email (str): O endereço de e-mail do usuário.
    """
    email: str

class UserCreate(UserBase):
    """Esquema para criação de um novo usuário.

    Herda de UserBase e adiciona campos necessários para o registro.

    Atributos:
        password (str): A senha do usuário.
        role (Optional[str]): O papel do usuário (ex: 'student', 'teacher'). Padrão: 'student'.
    """
    password: str
    role: Optional[str] = "student"

class User(UserBase):
    """Esquema completo para representação de um usuário.

    Herda de UserBase e adiciona campos de identificação e status.

    Atributos:
        id (int): O ID único do usuário.
        is_active (bool): Indica se o usuário está ativo.
        role (str): O papel do usuário.
    """
    id: int
    is_active: bool
    role: str

    class Config:
        # Configuração para permitir que o modelo seja criado a partir de atributos de ORM
        from_attributes = True

class Token(BaseModel):
    """Esquema para o token de autenticação JWT.

    Atributos:
        access_token (str): O token de acesso JWT.
        token_type (str): O tipo do token (geralmente 'bearer').
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Esquema para os dados contidos no payload do token JWT.

    Atributos:
        email (Optional[str]): O e-mail do usuário, se presente no token.
    """
    email: Optional[str] = None