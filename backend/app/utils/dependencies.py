from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db
from .security import get_current_user

async def get_current_active_professor(current_user: models.Usuario = Depends(get_current_user)):
    if current_user.tipo != models.TipoUsuario.professor:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return current_user

async def get_current_active_aluno(current_user: models.Usuario = Depends(get_current_user)):
    if current_user.tipo != models.TipoUsuario.aluno:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return current_user