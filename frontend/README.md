# SOWA Frontend

Este documento fornece informações específicas sobre o frontend do projeto SOWA, desenvolvido em Next.js e React para oferecer uma interface de usuário intuitiva e segura.

## Funcionalidades do Frontend

### 1. Interface de Usuário

- Design responsivo e moderno com Tailwind CSS.
- Fluxos de usuário claros para alunos e professores.

### 2. Interação com o Backend

- Consumo de APIs RESTful do backend para autenticação, gerenciamento de usuários, provas e turmas.
- Exibição de dados de provas e resultados.

### 3. Monitoramento de Segurança (Client-Side)

- Detecção de eventos suspeitos durante a realização de provas:
  - Saída do modo tela cheia.
  - Troca de abas ou aplicativos.
  - Uso de atalhos de teclado (ex: `Ctrl+C`, `Ctrl+V`, `Alt+Tab`).
  - Tentativas de abrir o console do navegador (`F12`, `Ctrl+Shift+I`).
- Envio desses eventos para o backend para registro e análise.

### 4. Funcionalidades Específicas

- **Para Alunos:**
  - Login e visualização de provas disponíveis.
  - Interface para realização de provas com temporizador.
  - Visualização de notas e feedback após a correção.
- **Para Professores:**
  - Login e acesso a painel de controle.
  - Criação e edição de provas.
  - Gerenciamento de turmas e alunos.
  - Visualização de logs de segurança e relatórios de fraude.

## Configuração e Execução

1. Instale as dependências do Node.js:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará acessível em `http://localhost:3000`.

## Estrutura de Pastas

- `src/app/`: Contém as páginas e layouts da aplicação Next.js.
- `src/components/`: Componentes React reutilizáveis.
- `src/utils/`: Funções utilitárias, incluindo a lógica de `securityMonitor.ts`.
- `public/`: Arquivos estáticos.

## Saiba Mais

Para aprender mais sobre Next.js, React e TypeScript, consulte a documentação oficial:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
