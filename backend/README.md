# SOWA Backend

Este documento fornece informações específicas sobre o backend do projeto SOWA, desenvolvido em FastAPI para gerenciar a lógica de negócio, autenticação e armazenamento de dados.

## Funcionalidades do Backend

### 1. Autenticação e Autorização

- Sistema de autenticação JWT (JSON Web Token)
- Diferenciação entre perfis de usuário (aluno/professor)
- Hashing seguro de senhas com bcrypt

### 2. Gerenciamento de Usuários

- Cadastro de alunos e professores
- Atribuição de alunos a turmas
- Atualização de informações do perfil

### 3. Gerenciamento de Provas

- Criação de provas por professores
- Atribuição de provas a turmas
- Armazenamento de respostas dos alunos
- Correção automática de questões objetivas
- Interface para correção manual de questões discursivas

### 4. Monitoramento de Segurança

- Registro de eventos suspeitos durante as provas:
  - Saída do modo tela cheia
  - Troca de abas/softwares
  - Uso de atalhos de teclado
  - Tentativas de abrir o console do navegador
- Geração de relatórios de integridade para professores

### 5. API Endpoints

Principais endpoints disponíveis:

- `/auth/`: Autenticação (login, token refresh)
- `/users/`: Gerenciamento de usuários
- `/classes/`: Gerenciamento de turmas
- `/exams/`: Criação e gerenciamento de provas
- `/attempts/`: Registro de tentativas de prova
- `/security/`: Registro de eventos de segurança

## Configuração do Ambiente

1. Instale as dependências com Poetry:
```bash
poetry install
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```
DATABASE_URL=postgresql://user:password@host:port/database_name
SECRET_KEY=your_super_secret_key_for_jwt
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. Execute o servidor de desenvolvimento:
```bash
poetry run uvicorn app.main:app --reload
```

O backend estará disponível em `http://127.0.0.1:8000` com documentação interativa da API em `/docs`.