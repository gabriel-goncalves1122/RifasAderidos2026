# AGENTS.md - Sistema De Rifas

## Papel Do Agente

Voce e um agente de engenharia trabalhando no projeto `sistema-rifas`.

O projeto possui:

- frontend em React, Vite, TypeScript, MUI e Firebase Web SDK;
- backend em Firebase Functions, Express, TypeScript e Firestore/Admin SDK.

Antes de editar qualquer arquivo, leia a estrutura atual, entenda o contexto da tarefa e proponha um plano curto quando a mudanca nao for trivial.

## Regra Principal

Faca mudancas pequenas, seguras e testaveis.

Para refatoracoes amplas, explique antes:

1. quais arquivos pretende alterar;
2. por que a mudanca e necessaria;
3. quais testes pretende rodar;
4. quais riscos existem.

## Hierarquia Dos Guias

Use o AGENTS mais especifico do caminho em que estiver trabalhando:

```txt
sistema-rifas/
├── AGENTS.md
├── frontend/AGENTS.md
└── backend/
    ├── AGENTS.md
    └── functions/
        ├── src/AGENTS.md
        └── tests/AGENTS.md
```

Guias de modulo podem existir quando o dominio tiver regras proprias. Eles complementam, mas nao substituem, as regras globais.

## Escopo Padrao

Nao altere backend sem autorizacao explicita.

Quando a tarefa estiver em uma area especifica, siga o guia dessa area e mantenha a mudanca limitada ao dominio pedido.

## Proibicoes Globais Sem Autorizacao

Nao fazer sem autorizacao:

- alterar backend;
- alterar autenticacao;
- alterar regras do Firebase;
- alterar `.env`, `.env.local` ou runtime config;
- versionar credenciais;
- apagar arquivos legados definitivamente;
- remover testes sem cobertura equivalente;
- criar integracao direta do frontend com APIs externas sensiveis;
- criar endpoints reais de provedor financeiro sem plano aprovado.

## Seguranca

Nunca versionar:

```txt
.env
.env.local
.env.*.local
backend/banco-local
backend/firebase-export-*
*chave*.json
*credentials*.json
*secret*.json
*serviceAccount*.json
```

Se encontrar credencial local, nao abra nem copie conteudo salvo necessidade extrema.

## Fluxo De Trabalho

1. Entender a tarefa.
2. Identificar arquivos envolvidos.
3. Alterar o minimo necessario.
4. Atualizar imports e testes quando aplicavel.
5. Rodar ou justificar testes/build.
6. Listar o que mudou e pendencias.

## Comandos Uteis

Frontend:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
npm run test:run
npm run build
```

Backend:

```bash
cd backend/functions
npm run build
npm test
```

Emuladores:

```bash
cd backend
firebase emulators:start \
  --project rifasaderidos2026 \
  --only firestore,auth,storage,functions \
  --import banco-local \
  --export-on-exit banco-local
```

Nao rode deploy sem pedido explicito.

## Git

Antes de commit:

```bash
git status --short
```

Nao reverta mudancas de outro trabalho sem pedido explicito.
