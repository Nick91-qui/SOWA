# backend/app/core/security.py

"""Módulo de segurança para manipulação de senhas e tokens JWT.

Este módulo fornece funções para hashing e verificação de senhas,
além de criação e decodificação de tokens de acesso JWT.
"""

from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Contexto para hashing de senhas usando o algoritmo bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se uma senha em texto plano corresponde a uma senha hash.

    Args:
        plain_password (str): A senha em texto plano fornecida pelo usuário.
        hashed_password (str): A senha hash armazenada no banco de dados.

    Returns:
        bool: True se as senhas corresponderem, False caso contrário.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gera um hash de uma senha em texto plano.

    Args:
        password (str): A senha em texto plano a ser hashed.

    Returns:
        str: O hash da senha.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria um token de acesso JWT.

    Args:
        data (dict): Dados a serem incluídos no payload do token.
        expires_delta (Optional[timedelta], optional): Tempo de expiração do token.
            Se não fornecido, usa o tempo de expiração padrão das configurações.

    Returns:
        str: O token JWT codificado.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decodifica um token de acesso JWT.

    Args:
        token (str): O token JWT a ser decodificado.

    Returns:
        Optional[dict]: O payload do token se for válido, None caso contrário.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None