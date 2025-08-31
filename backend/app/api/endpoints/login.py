# backend/app/api/endpoints/login.py

"""Módulo de endpoints da API para autenticação de usuários.

Contém rotas para login (geração de token de acesso) e teste de token.
"""

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.api import deps
from app.models.user import User as DBUser
from app.schemas.user import Token, User as UserSchema

# Cria um roteador APIRouter para os endpoints de login
router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Realiza o login do usuário e gera um token de acesso JWT.

    Verifica as credenciais do usuário e, se válidas, retorna um token de acesso.

    Args:
        db (Session): A sessão do banco de dados, injetada como dependência.
        form_data (OAuth2PasswordRequestForm): Dados do formulário de login (username e password).

    Returns:
        Any: Um dicionário contendo o token de acesso e o tipo do token.

    Raises:
        HTTPException: Se as credenciais forem inválidas.
    """
    # Busca o usuário no banco de dados pelo email (username)
    user = db.query(DBUser).filter(DBUser.email == form_data.username).first()
    # Verifica se o usuário existe e se a senha está correta
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    # Define o tempo de expiração do token de acesso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Retorna o token de acesso e o tipo do token
    return {
        "access_token": create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login/test-token", response_model=UserSchema)
def test_token(current_user: DBUser = Depends(deps.get_current_user)) -> Any:
    """Testa a validade de um token de acesso.

    Retorna as informações do usuário associado ao token, se o token for válido.

    Args:
        current_user (DBUser): O usuário autenticado, injetado como dependência.

    Returns:
        Any: O objeto UserSchema do usuário atual.
    """
    # Retorna o usuário autenticado no formato do esquema UserSchema
    return UserSchema.from_orm(current_user)