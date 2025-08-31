# SOWA - Secure Online Web Assessment

Este documento fornece uma visão geral do projeto SOWA, um sistema de avaliação online seguro, desenvolvido para gerenciar exames e monitorar a integridade dos alunos durante as provas. O sistema é dividido em duas partes principais: um backend robusto em FastAPI e um frontend interativo em Next.js.

## 1. Visão Geral do Projeto

O SOWA é uma plataforma abrangente para a criação, aplicação e avaliação de exames online, com foco em segurança e prevenção de fraudes. Ele permite que professores criem e gerenciem provas, enquanto alunos podem realizar exames e visualizar seus resultados. O sistema também inclui funcionalidades de monitoramento para detectar comportamentos suspeitos durante as avaliações.

## 2. Funcionalidades Principais

### 2.1. Cadastro de Usuários

O sistema permite o cadastro de dois tipos de usuários:

*   **Alunos:** Podem se registrar para acessar as provas.
*   **Professores:** Podem ser cadastrados para gerenciar provas e turmas.

### 2.2. Funcionalidades para Alunos

Após o login, os alunos podem:

*   **Logar no Sistema:** Acessar sua conta com credenciais.
*   **Escolher Provas a Fazer:** Visualizar uma lista de provas disponíveis e selecionar qual deseja realizar.
*   **Fazer Provas:** Realizar os exames online, com monitoramento de segurança ativo.
*   **Ver Notas da Prova após Correção:** Acessar os resultados e pontuações de suas provas após a avaliação pelo professor.

### 2.3. Funcionalidades para Professores

Após o login, os professores podem:

*   **Criar Turmas:** Organizar alunos em turmas para facilitar a atribuição de provas.
*   **Criar Provas:** Elaborar novos exames, definindo questões, tempo limite e outras configurações.
*   **Avaliar Provas Feitas pelos Alunos:** Acessar as provas submetidas pelos alunos para correção e atribuição de notas.
*   **Receber Logs de Tentativa de Evadir o Sistema da Prova (Cola):** Visualizar relatórios de segurança que indicam comportamentos suspeitos detectados durante as provas dos alunos (ex: saída de tela cheia, troca de abas, uso de atalhos de teclado).

## 3. Arquitetura do Sistema

O SOWA é construído com uma arquitetura de microsserviços, separando o frontend e o backend para maior escalabilidade e manutenção:

*   **Backend (FastAPI):** Desenvolvido em Python, utilizando o framework FastAPI para a criação de APIs RESTful. Gerencia a lógica de negócio, autenticação de usuários, armazenamento de dados (PostgreSQL) e o registro de eventos de fraude.
*   **Frontend (Next.js):** Desenvolvido em TypeScript com Next.js e React, oferece uma interface de usuário responsiva e intuitiva. Interage com o backend através de chamadas de API e implementa o monitoramento de segurança no lado do cliente.

## 4. Tecnologias Utilizadas

*   **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Pydantic, Python-jose, Passlib, Poetry.
*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS.

## 5. Configuração e Execução (Visão Geral)

Para configurar e executar o projeto, é necessário configurar tanto o ambiente do backend quanto o do frontend. Ambos possuem seus próprios `README.md`s detalhados para instruções de instalação e execução.

## 6. Segurança

O sistema incorpora funcionalidades de segurança como autenticação JWT, hashing de senhas e monitoramento de atividades do usuário durante as provas para detectar e registrar tentativas de fraude.

---

Para informações mais detalhadas sobre a configuração e execução de cada parte do projeto, consulte os `README.md`s específicos nas pastas `backend/` e `frontend/`.