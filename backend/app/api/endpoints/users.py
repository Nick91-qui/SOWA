# backend/app/api/endpoints/users.py

"""Módulo de endpoints da API para gerenciamento de usuários.

Contém rotas para criar novos usuários e obter informações do usuário atual.
"""

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.core.security import get_password_hash
from app.models.user import User as DBUser
from app.schemas.user import UserCreate, User as UserSchema

# Cria um roteador APIRouter para os endpoints de usuário
router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
    role: Optional[str] = "student",
) -> Any:
    """Cria um novo usuário no sistema.

    Verifica se o e-mail já existe e, em caso afirmativo, levanta uma exceção HTTP.
    Faz o hash da senha e armazena o novo usuário no banco de dados.

    Args:
        db (Session): A sessão do banco de dados, injetada como dependência.
        user_in (UserCreate): Os dados do usuário a ser criado.
        role (Optional[str]): O papel do usuário (ex: 'student', 'teacher'). Padrão: 'student'.

    Returns:
        Any: O objeto UserSchema do usuário recém-criado.

    Raises:
        HTTPException: Se um usuário com o mesmo e-mail já existir.
    """
    # Consulta o banco de dados para verificar se já existe um usuário com o e-mail fornecido
    user = db.query(DBUser).filter(DBUser.email == user_in.email).first()
    if user:
        # Se o usuário já existe, levanta uma exceção HTTP 400
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    # Gera o hash da senha fornecida
    hashed_password = get_password_hash(user_in.password)
    # Cria uma nova instância do modelo de usuário com os dados fornecidos e a senha com hash
    user = DBUser(email=user_in.email, hashed_password=hashed_password, role=role)
    # Adiciona o novo usuário à sessão do banco de dados
    db.add(user)
    # Confirma as alterações no banco de dados
    db.commit()
    # Atualiza o objeto do usuário com os dados do banco de dados (incluindo o ID gerado)
    db.refresh(user)
    # Retorna o usuário recém-criado no formato do esquema UserSchema
    return UserSchema.from_orm(user)

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: DBUser = Depends(deps.get_current_user),
) -> Any:
    """Obtém as informações do usuário atualmente autenticado.

    Args:
        current_user (DBUser): O usuário autenticado, injetado como dependência.

    Returns:
        Any: O objeto UserSchema do usuário atual.
    """
    # Retorna o usuário autenticado no formato do esquema UserSchema
    return UserSchema.from_orm(current_user)