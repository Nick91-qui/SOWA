# backend/app/main.py

"""Módulo principal da aplicação FastAPI.

Este módulo inicializa a aplicação FastAPI, configura o middleware CORS
e inclui os roteadores da API.
"""

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings
from app.models import user, fraud_log, exam, exam_session

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Inicializa a aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME, # Título do projeto obtido das configurações
    openapi_url=f"{settings.API_V1_STR}/openapi.json" # URL para a documentação OpenAPI
)

# Lista de origens permitidas para o CORS
# Isso permite que o frontend (e outras aplicações) acessem a API
origins = [
    "http://localhost",
    "http://localhost:3000", # Frontend em desenvolvimento
    "http://localhost:8000", # Backend em desenvolvimento
    "http://localhost:8080",
    "https://sowa-zeta.vercel.app", # Frontend em produção
    "https://sowa-backend.onrender.com" # Backend em produção
]

# Adiciona o middleware CORS à aplicação
# Isso configura as permissões de Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Permite requisições das origens listadas
    allow_credentials=True, # Permite o envio de cookies em requisições cross-origin
    allow_methods=["GET", "POST", "PUT", "DELETE"], # Métodos HTTP permitidos
    allow_headers=["*"] # Permite todos os cabeçalhos em requisições cross-origin
)

# Inclui o roteador principal da API com um prefixo
# Todos os endpoints definidos em api_router serão acessíveis sob este prefixo
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def read_root():
    """Endpoint raiz da API.

    Retorna uma mensagem de boas-vindas à API da Plataforma de Exames Online.
    """
    return {"message": "Welcome to the Online Exam Platform API"}