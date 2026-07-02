# AGENTS.md - Backend

## Escopo

Este guia vale para tudo dentro de `backend/`.

O backend usa Firebase Functions v2, Express, TypeScript, Firestore/Admin SDK, Firebase Auth, Firebase Storage, Jest e Supertest.

O pacote real de codigo fica em `backend/functions/`. Arquivos fora desse pacote normalmente sao configuracao Firebase, rules, exports locais, logs ou artefatos de emulador.

## Fronteira Do Backend

Nao altere backend apenas para atender uma necessidade de UI sem confirmar o contrato esperado pelo frontend.

Quando uma mudanca afetar endpoint, payload, permissao, Firestore ou Storage:

- preserve compatibilidade quando houver consumidor existente;
- atualize ou crie testes;
- documente a mudanca quando ela alterar contrato publico.

## Estrutura

```txt
backend/
├── AGENTS.md
├── docs/
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
└── functions/
    ├── package.json
    ├── jest.config.js
    ├── tsconfig.json
    ├── src/
    └── tests/
```

## Middleware Stack Atual

O `index.ts` do backend configura nesta ordem:

1. **helmet** — headers de seguranca HTTP;
2. **express-rate-limit** — 60 req/min global, 10/min auth, 30/min webhook;
3. JSON parser com `verify` para raw body (necessario para webhook);
4. CORS (configuracao explicita, nunca `*`);
5. Rotas dos modulos;
6. Error handler global (`shared/middlewares/errorHandler.ts`).

## Schema Validation

Payloads de entrada devem ser validados com o middleware `validate`
(`shared/middlewares/validate.ts`) usando schemas yup:

```ts
router.post("/checkout/pix", validate(checkoutPixSchema), controller.criar);
```

O schema define formato, tipos e campos obrigatorios. O middleware usa
`stripUnknown: true` e `abortEarly: false`.

## Arquivos Gerados E Locais

Nao edite nem use como fonte de verdade:

```txt
backend/functions/lib/
backend/functions/node_modules/
backend/banco-local/
backend/firebase-export-*/
backend/*.log
backend/functions/*.log
```

O codigo-fonte fica em `backend/functions/src`.

## Seguranca E Limites

Nao fazer sem autorizacao explicita:

- alterar `firestore.rules`;
- alterar `storage.rules`;
- alterar autenticacao, claims ou cargos aceitos;
- criar ou trocar credenciais;
- alterar `.env` ou runtime config;
- deployar Functions;
- apagar exports locais de emulador;
- criar integracao direta sensivel com provedores externos;
- alterar contratos publicos sem teste e nota de compatibilidade.

Nunca versionar:

```txt
.env
.env.local
.env.*.local
*.local
*chave*.json
*credentials*.json
*secret*.json
*serviceAccount*.json
backend/banco-local
backend/firebase-export-*
```

## Comandos

Use sempre a partir de `backend/functions` para o pacote Functions:

```bash
cd backend/functions
npm run build
npm test
```

Emuladores a partir da raiz do repositorio, em terminal separado do frontend:

```bash
npm run dev:emulators
```

O `firebase.json` da raiz e a unica configuracao Firebase. O comando executa
build limpo, TypeScript watch e Firebase com encerramento coordenado. Consulte
`docs/desenvolvimento-local.md` para setup Linux e diagnostico de portas.

Nao rode `firebase deploy` sem pedido explicito.

## Garantias Transacionais (ACID)

Use `firestore.runTransaction()` para qualquer operacao que altere duas ou mais
colecoes. Isso inclui checkout Pix, webhook, aceitar/negar transacao.

Evite ler documentos fora da transacao quando forem usados dentro dela — leia
sempre dentro da propria transacao para evitar condicoes de corrida.

## Logging

Use `console` com prefixo `[NomeModulo]` padronizado em todas as camadas. Ex:

- `console.log("[RifasController] ...")`
- `console.error("[TesourariaService] ...")`

Nao logue dados sensiveis como tokens, senhas de acesso ou links de reset completos.

## CORS

A configuracao CORS deve ser extraivel para um modulo testavel. Mantenha as
origens permitidas em lista explicita ou regex — nunca `*` em producao.

## Comentarios No Codigo

Comente apenas o que ajuda manutencao. Nao comente o obvio.

Situacoes que merecem comentario:

- regra de negocio (explicar o "por que", nao o "o que");
- decisao de arquitetura (por que escolheu este padrao);
- fallback temporario (`// TEMP: <motivo>`);
- compatibilidade legada (por que um campo antigo existe);
- integracao externa (contrato esperado do provedor);
- ponto nao obvio (algoritmo, formula ou condicao contra-intuitiva).

Nao comente: nomes auto-explicativos, chamadas de API padrao, uso obvio do framework.

## Guias Especificos

- Codigo-fonte Functions: `backend/functions/src/AGENTS.md`
- Testes Functions: `backend/functions/tests/AGENTS.md`
- Documentacao tecnica: `backend/docs/README.md`
- Modulos: `backend/functions/src/modules/<modulo>/AGENTS.md`

## Antes De Finalizar

Para mudanca de codigo em Functions, rode:

```bash
cd backend/functions
npm run build
npm test
```

Para mudanca apenas documental, valide ao menos:

```bash
git status --short
find backend -name AGENTS.md -print | sort
```
