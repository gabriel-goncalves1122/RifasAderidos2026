# AGENTS.md - Backend Functions Src

## Escopo

Este guia vale para `backend/functions/src/`.

Aqui ficam as Cloud Functions Express em TypeScript. Nao importe codigo de `backend/functions/lib`; `lib` e saida de build.

## Arquitetura

```txt
src/
├── index.ts
├── routes.ts
├── modules/
│   ├── admin/
│   ├── auditoria/
│   ├── auth/
│   ├── notificacoes/
│   ├── premios/
│   ├── rifas/
│   ├── tesouraria/
│   └── types/
├── scripts/
└── shared/
    ├── config/
    └── middlewares/
```

Responsabilidades:

- `index.ts`: inicializa Firebase Admin, Express, CORS, JSON parser, status e `onRequest`.
- `routes.ts`: delega prefixos para mini-roteadores dos modulos.
- `modules/*`: regras de dominio, controllers, routes, services, helpers e types locais.
- `modules/types`: contratos compartilhados de modelo quando usados por mais de um dominio.
- `shared/config`: configuracao global.
- `shared/middlewares`: middlewares compartilhados, como autenticacao.
- `scripts`: utilitarios operacionais locais.

## Padrao De Modulo

Use o padrao atual por dominio:

```txt
modules/<dominio>/
├── <dominio>Routes.ts
├── <dominio>Controller.ts
├── <dominio>Service.ts
├── controllers/
├── routes/
├── services/
├── helpers/
└── types/
```

Nem todo modulo precisa de todas as pastas. Crie uma pasta apenas quando ela separar responsabilidade real.

## Controllers

Controllers devem:

- receber `Request` ou `AuthRequest`;
- validar entradas minimas da requisicao;
- chamar services ou fachadas do dominio;
- responder com status HTTP e JSON;
- capturar erros esperados e retornar mensagens estaveis;
- evitar regra pesada de Firestore, calculo ou integracao.

Nao misture controller com acesso direto ao Firestore quando ja existir service para o dominio.

## Routes

Routes devem:

- montar endpoints Express;
- aplicar middlewares explicitamente;
- manter comentarios curtos de contrato quando o endpoint for consumido pelo frontend;
- herdar prefixos definidos em `src/routes.ts`.

Ao criar endpoint novo, atualize o roteador do modulo e adicione teste de rota.

## Services E Helpers

Services devem:

- concentrar acesso ao Firestore/Admin SDK;
- orquestrar regras de negocio do dominio;
- normalizar payloads retornados para controllers;
- evitar depender de `Response`, `Request` ou Express.

Helpers devem:

- concentrar regra pura e deterministica;
- nao acessar Firestore/Admin SDK;
- nao importar Express;
- ser testados diretamente quando tiverem regra relevante.

Use fachadas como `RifasService` ou `TesourariaService` quando o dominio ja tiver esse padrao, delegando para services internos menores.

## Types E Modelos

- Tipos compartilhados devem ir em `modules/types/models.ts`.
- Tipos especificos devem ir em `modules/<dominio>/types`.
- Evite `any`; quando precisar lidar com dados Firestore legados, isole a conversao.
- Nao altere nomes de campos persistidos sem plano de migracao.
- Preserve campos usados pelo frontend ate atualizar frontend e testes juntos.

## Auth E Permissoes

- `validateToken` e o contrato minimo para rotas autenticadas.
- Use middlewares compartilhados quando a regra vale para varios dominios.
- Para regras especificas, prefira middleware pequeno e testado.
- Nao alterar roles/cargos aceitos sem validar impacto no frontend e nas contas existentes.

## Scripts

Scripts em `src/scripts` sao operacionais e devem ser tratados com cuidado.

Regras:

- nao versionar chaves, service accounts ou dumps reais;
- nao usar scripts de producao sem confirmacao explicita;
- preferir mocks/emuladores em testes;
- documentar parametros quando criar script novo.

## Testes

Os testes ficam em `backend/functions/tests` e seguem `backend/functions/tests/AGENTS.md`.

Ao alterar endpoint, payload, controller, service, helper ou middleware, atualize os testes correspondentes.

## Build

Antes de finalizar mudanca de codigo:

```bash
cd backend/functions
npm run build
npm test
```
