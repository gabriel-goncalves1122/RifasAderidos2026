# AGENTS.md - Modulo Notificacoes

## Escopo

Este modulo gerencia notificacoes do sistema para os usuarios (aderidos e admin).

Ele cobre:
- listagem de notificacoes do usuario logado;
- marcar notificacao como lida;
- criacao interna de notificacoes (usada por outros modulos).

## Estrutura

```
modules/notificacoes/
├── AGENTS.md
├── notificacoesController.ts
├── notificacoesRoutes.ts
├── notificacoesService.ts
└── types/
    └── notificacoesTypes.ts
```

## Rotas

```
GET    /notificacoes
PATCH  /notificacoes/:id
```

## Regras

- `GET /notificacoes` retorna apenas notificacoes do usuario autenticado.
- `PATCH /notificacoes/:id` marca como lida. So o dono pode alterar.
- A criacao de notificacoes e feita internamente por services de outros modulos
  (ex: `rifasService` ao liberar rifa, `tesourariaService` ao negar transacao).
- Nao crie endpoint publico para criar notificacoes.

## Estrutura do documento

```ts
interface Notificacao {
  id: string;
  vendedor_id: string;
  tipo: "rifa_liberada" | "correcao_dados" | "recibo_aprovado";
  lida: boolean;
  criada_em: Timestamp;
  dados?: Record<string, unknown>;
}
```

## Testes

Testes ficam em `backend/functions/tests/notificacoes`.

Siga `backend/functions/tests/AGENTS.md`.
