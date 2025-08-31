# backend/app/models/user.py

"""Módulo de modelo de usuário.

Define o modelo de banco de dados para usuários.
"""

from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    """Modelo de banco de dados para usuários.

    Atributos:
        id (int): Identificador único do usuário (chave primária).
        email (str): Endereço de e-mail do usuário (único e indexado).
        hashed_password (str): Senha do usuário com hash.
        is_active (bool): Indica se o usuário está ativo (padrão: True).
        role (str): Papel do usuário (ex: 'student', 'teacher'). Padrão: 'student'.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student")