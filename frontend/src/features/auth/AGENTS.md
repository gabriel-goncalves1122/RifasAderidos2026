# AGENTS.md - Feature Auth

## Papel Desta Feature

O módulo `auth` gerencia a autenticação de usuários da aplicação utilizando o Firebase Auth e Firestore. É responsável por prover o contexto de usuário (`AuthContext`), validar permissões e encaminhar callbacks para login via Google, Apple ou Email/Senha.

## Regras de Arquitetura

1. **Barrel Policy**: Não utilize arquivos `index.ts` em subdiretórios (ex: `hooks/`, `services/`, `context/`). Todos os imports internos dentro de `frontend/src/features/auth` devem ser diretos.
2. **Isolamento**: O `AuthContext` é a única fonte da verdade para o usuário logado e sua "Role" (ex: ADERIDO, ADMIN, COMISSAO). Outras features devem usar o hook `useAuth()` para checar permissões, não interagindo diretamente com o Firebase Auth.
3. **Roles e Rules**: As informações ricas de `Role` e escopo vêm do Firestore (`usuarios/{uid}` ou coleção equivalente de controle de acesso), e não apenas da Claim do token JWT do Auth, mantendo sincronia com os usuários legados quando aplicável.
4. **Pendência de API de perfil**: ainda não existe rota real `GET /auth/usuario`; até ela existir, `useAuthController` pode observar Firestore para cargo/nome. Ao criar esse endpoint, migre a leitura para `fetchAPI` e mantenha compatibilidade com usuários legados.

## Estrutura de Diretórios Esperada

- `context/`: `AuthContext.tsx` e `AuthProvider.tsx` para prover estado global.
- `hooks/`: `useAuth.ts`, `useAuthController.ts`.
- `services/`: Encapsulamento das chamadas a `signInWithPopup`, `signOut`, etc.
- `types/`: Interfaces de `UsuarioApp`, `UserRole`, etc.
- `AGENTS.md`: Este guia.

## Fluxos Críticos

* Nunca injete chaves de acesso manuais. Todo fluxo usa o cliente pré-configurado de Firebase via `shared/services/firebase.ts`.
* Erros de login (usuário não encontrado ou banido) devem ser disparados como `AppError` ou tratados e mostrados via componentes de Feedback/Toast/Notification de `shared/components`.
* Logs técnicos no console devem ficar protegidos por `import.meta.env.DEV`, para evitar expor detalhes em produção.

## Notas de Manutenção

- Ao modificar provedores de login, garanta compatibilidade com `npm run dev:emulators` na raiz, utilizando as contas locais fornecidas por `backend/banco-local`.
