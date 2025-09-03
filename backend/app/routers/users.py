from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models
from ..schemas.usuario import UsuarioInDB as UsuarioSchema
from ..database import get_db
from ..utils.security import get_current_active_user

router = APIRouter()

@router.get("/users/me", response_model=UsuarioSchema)
async def read_users_me(current_user: models.Usuario = Depends(get_current_active_user)):
    return current_user