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

Emuladores a partir de `backend`:

```bash
cd backend
firebase emulators:start \
  --project rifasaderidos2026 \
  --only firestore,auth,storage,functions \
  --import banco-local \
  --export-on-exit banco-local
```

Nao rode `firebase deploy` sem pedido explicito.

## Guias Especificos

- Codigo-fonte Functions: `backend/functions/src/AGENTS.md`
- Testes Functions: `backend/functions/tests/AGENTS.md`
- Documentacao tecnica: `backend/docs/README.md`

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
