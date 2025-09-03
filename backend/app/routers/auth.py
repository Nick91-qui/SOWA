from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import schemas, models
from ..database import engine, get_db
from ..utils.security import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_active_user

models.Base.metadata.create_all(bind=engine)

router = APIRouter()



@router.post("/register", response_model=schemas.UsuarioInDB)
def register_user(user: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.senha)
    db_user = models.Usuario(nome=user.nome, email=user.email, senha_hash=hashed_password, tipo=user.tipo)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_type": user.tipo.value},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_type": user.tipo.value}

@router.post("/logout")
async def logout_user(current_user: models.Usuario = Depends(get_current_active_user)):
    # In a token-based authentication system, logout typically involves client-side token removal.
    # However, if you want to invalidate tokens on the server side, you would implement a mechanism here,
    # such as adding the token to a blacklist or revoking it from a database.
    # For this example, we'll just return a success message, assuming client-side token removal.
    return {"message": "Successfully logged out"}