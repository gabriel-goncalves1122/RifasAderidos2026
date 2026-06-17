# AGENTS.md - Modulo Premios

## Escopo

Este modulo e o dominio backend da gestao de premios do sorteio.

Ele cobre:
- CRUD de premios (criar, listar, editar, excluir);
- atualizacao do cabecalho do sorteio (titulo, data, descricao);
- upload de imagem para premio no Firebase Storage.

## Estrutura

```
modules/premios/
├── AGENTS.md
├── premiosController.ts
├── premiosRoutes.ts
├── premiosService.ts
└── types/
    └── premiosTypes.ts
```

## Rotas

```
GET    /premios                  (publico — sem auth)
POST   /premios                 (validateToken + requireTesourariaOrAdmin)
PUT    /premios/sorteio          (validateToken + requireTesourariaOrAdmin)
DELETE /premios/:id             (validateToken + requireTesourariaOrAdmin)
```

Regras:
- `GET /premios` e publico (vitrine do sorteio). Nao exige token.
- As demais rotas exigem `validateToken` + `requireTesourariaOrAdmin`.
- O middleware `requireTesourariaOrAdmin` aceita cargos de tesouraria, presidencia
  e admin. Super-admins configurados em `SUPER_ADMIN_EMAILS` tambem passam.
- Upload de imagem e feito pelo frontend diretamente no Firebase Storage usando
  o SDK Web; o backend nao recebe arquivos de imagem em payloads.

## ACID

Nao ha operacoes financeiras neste modulo, portanto `runTransaction` nao e
obrigatorio. Use transacao apenas se no futuro houver consistencia mutua entre
premios e outro dominio (ex: vincular premio a rifa sorteada).

## Types

Contratos especificos ficam em `types/premiosTypes.ts`.

O response de `GET /premios` tem formato:
```ts
interface GetPremiosResponse {
  infoSorteio: { titulo: string; data: string; descricao: string };
  premios: PremioItem[];
}
```

## Testes

Testes ficam em `backend/functions/tests/premios`.

Siga `backend/functions/tests/AGENTS.md`.
