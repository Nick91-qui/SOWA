from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, turmas, provas, tentativas

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(turmas.router, prefix="/turmas", tags=["turmas"])
app.include_router(provas.router, prefix="/provas", tags=["provas"])
app.include_router(tentativas.router, prefix="/tentativas", tags=["tentativas"])

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao SOWA API"}