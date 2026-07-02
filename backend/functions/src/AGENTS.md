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
    ├── classes/        # AppError.ts
    ├── config/
    ├── middlewares/     # authMiddleware, errorHandler, validate, ...
    ├── services/       # pagBankPixClient, etc.
    └── utils/          # formatadores, sanitizadores, ...
```

Responsabilidades:

- `index.ts`: inicializa Firebase Admin, Express, helmet, rate-limit, JSON parser
  (com `verify` para raw body do webhook), CORS, status e `onRequest`.
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

## Transacoes (ACID)

Controllers e services financeiros DEVEM usar `runTransaction` do Firestore.

Regras:
- leia documentos DENTRO da transacao, nunca fora (evita condicao de corrida);
- se a operacao toca duas colecoes ou le+ecreve o mesmo documento, use transacao;
- helpers puros (que nao acessam Firestore) nao precisam de transacao.

Exemplo de estrutura esperada:

```ts
await db.runTransaction(async (transaction) => {
  const ref = db.collection("bilhetes").doc(id);
  const doc = await transaction.get(ref);
  if (!doc.exists) throw new AppError("NOT_FOUND", "...", 404);
  transaction.update(ref, { status: "pago" });
});
```

## Error Handling

Use `AppError` (em `shared/classes/AppError.ts`) para erros conhecidos:

```ts
throw new AppError("PIX_NOT_CONFIRMED", "Pagamento ainda nao confirmado", 409);
```

Crie middleware de erro global em `shared/middlewares/errorHandler.ts`:

```ts
(err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, code: err.code });
  }
  console.error("[ErrorHandler]", err);
  return res.status(500).json({ error: "Erro interno do servidor" });
};
```

Nao exponha `error.stack` ou mensagens internas em producao.

## Schema Validation (Middleware)

Para validar payloads de entrada, use o middleware `validate` em
`shared/middlewares/validate.ts` com um schema yup:

```ts
import { validate } from "../../shared/middlewares/validate";
import { checkoutPixSchema } from "../schemas/checkoutPixSchema";

router.post("/checkout/pix", validate(checkoutPixSchema), controller.criar);
```

O middleware usa `stripUnknown: true` e `abortEarly: false` para reportar todos
os erros de uma vez com status 400.

Crie schemas em `modules/<dominio>/schemas/` ao lado dos types.

## Logging

Use `console` com prefixo do modulo (`[RifasController]`, `[TesourariaService]`).

Crie um helper `shared/utils/logger.ts` quando houver necessidade de niveis ou
serializacao consistente.

Nao logue dados sensiveis: tokens Firebase, chaves de API, links de reset completos,
dados de cartao ou documentos pessoais.

## Contrato de API

Cada arquivo de rota DEVE exportar as interfaces de request e response.

Exemplo:

```ts
// modules/rifas/types/checkoutTypes.ts
export interface CheckoutPixRequest { rifasIds: string[]; ... }
export interface CheckoutPixResponse { pagamentoId: string; pixCopiaECola: string; }
```

O controller usa esses tipos no retorno. Isso permite que o frontend importe os
mesmos contratos (por copia ate haver monorepo).

## Auth E Permissoes

- `validateToken` e o contrato minimo para rotas autenticadas.
- Use middlewares compartilhados quando a regra vale para varios dominios.
- Para regras especificas, prefira middleware pequeno e testado.
- Nao alterar roles/cargos aceitos sem validar impacto no frontend e nas contas existentes.
- Nao hardcode super-admins. Use `process.env.SUPER_ADMIN_EMAILS` ou consulta ao Firestore.
- Crie `requireCargo(...cargos)` generico quando houver 2+ rotas com a mesma verificacao.

## Comentarios No Codigo

Comente apenas o que ajuda manutencao. Nao comente o obvio.

Situacoes que merecem comentario:

- **regra de negocio**: explicar o "por que", nao o "o que";
- **decisao de arquitetura**: por que escolheu este padrao;
- **fallback temporario**: `// TEMP: <motivo>` com issue vinculada;
- **compatibilidade legada**: porque um campo antigo ainda existe;
- **integracao externa**: contrato esperado do provedor;
- **ponto nao obvio**: algoritmo, formula ou edge case contra-intuitivo.

Nao comente: nomes auto-explicativos, chamadas de API padrao, uso obvio do Firestore/Express.

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

O build de producao usa `tsconfig.build.json`, compila somente `src` em
`lib/index.js` e limpa a saida antes de emitir. Nao inclua testes na pasta
observada pelo emulador. Para
desenvolvimento completo, use `npm run dev:emulators` na raiz do repositorio.
