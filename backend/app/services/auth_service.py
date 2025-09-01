from sqlalchemy.orm import Session
from ..models.usuario import Usuario
from ..schemas.usuario import UsuarioCreate
from ..utils.security import get_password_hash

def create_user(db: Session, user: UsuarioCreate):
    hashed_password = get_password_hash(user.senha)
    db_user = Usuario(nome=user.nome, email=user.email, senha_hash=hashed_password, tipo=user.tipo)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()