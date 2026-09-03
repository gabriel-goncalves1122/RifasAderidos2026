# AGENTS.md - Modulo Auth

## Escopo

Este modulo cuida da autenticacao e autorizacao de usuarios no sistema.

Ele cobre:
- criacao de conta no Firebase Auth;
- verificacao de elegibilidade (email institucional);
- geracao de link de reset de senha;
- consulta de dados do usuario autenticado.

## Estrutura

```
modules/auth/
├── AGENTS.md
├── authController.ts
├── authRoutes.ts
├── authService.ts
└── types/
    └── authTypes.ts
```

## Rotas

```
POST   /auth/criar-conta
POST   /auth/verificar-elegibilidade
GET    /auth/usuario
POST   /auth/reset-senha
```

## Regras

- So permite criacao de conta com email institucional (usp.br, unifei.edu.br, etc).
- Nao logue links de reset completos — apenas o email de destino.
- Use `AppError` para erros conhecidos: `USUARIO_NAO_ENCONTRADO`, `EMAIL_JA_EXISTE`.
- Nao exponha `cargo` ou `uid` em rotas publicas.

## Seguranca

- Nao retornar tokens de acesso nos responses.
- Nao aceitar alteracao de `cargo` ou `super_admin` vindas do cliente.
- Validar email antes de criar conta no Firebase Auth.

## Testes

Testes ficam em `backend/functions/tests/auth`.

Siga `backend/functions/tests/AGENTS.md`.
