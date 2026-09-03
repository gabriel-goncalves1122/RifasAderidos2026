# AGENTS.md - Modulo Auditoria

## Escopo

Este modulo e uma camada de compatibilidade que re-exporta rotas e logicas do
fluxo de auditoria legado (`tesouraria/legacy/auditoria/`).

Ele cobre:
- endpoints historicos de auditoria consumidos pelo frontend;
- delegacao para `tesouraria/legacy/auditoria/`.

## Estrutura

```
modules/auditoria/
├── AGENTS.md
├── auditoriaController.ts  (re-exporta / delega)
├── auditoriaRoutes.ts
├── auditoriaService.ts     (re-exporta / delega)
└── types/
    └── auditoriaTypes.ts
```

## Regras

- Nao adicione logica nova de auditoria aqui. Todo codigo novo de auditoria
  deve ir para `modules/tesouraria/`.
- Este modulo existe apenas para preservar compatibilidade com consumidores
  existentes das rotas `/auditorias/*`.
- Se um consumidor deixar de usar as rotas antigas, o modulo pode ser removido.

## Rotas preservadas

```
GET    /auditorias
GET    /auditorias/:id
POST   /auditorias/:id/aceitar
POST   /auditorias/:id/negar
```

## Testes

Testes ficam em `backend/functions/tests/auditoria`.

Siga `backend/functions/tests/AGENTS.md`.
