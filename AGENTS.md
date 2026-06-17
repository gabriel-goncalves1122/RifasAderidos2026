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

## Garantias Transacionais (ACID)

Operacoes financeiras DEVEM usar `runTransaction` do Firestore:

- checkout Pix: reserva atomica + criacao de pagamento numa unica transacao;
- webhook Pix: atualizacao de status + liberacao de rifas + notificacao atomica;
- aceitar/negar transacao: mudanca de status + registro de auditoria atomicos.

Nao use `set`/`update` individuais separados sem transacao em fluxos que envolvem
duas ou mais colecoes ou documentos que precisam de consistencia mutua.

**TOCTOU:** leia documentos DENTRO da transacao, nunca fora. Se precisar de
pre-check antes de chamar API externa (ex: PagBank), faca-o fora da transacao
mas SEMPRE re-valide dentro dela antes de escrever.

Exemplo: `checkoutPixService.ts` faz pre-check de disponibilidade antes de
chamar PagBank, mas le e valida novamente cada rifa dentro da `runTransaction`
para eliminar a race condition entre pre-check e escrita.

## Contrato Entre Camadas

Toda rota do backend DEVE exportar os tipos TypeScript de request e response.

O frontend importa esses tipos de `backend/functions/src/modules/<dominio>/types/`
por copia direta (enquanto nao houver monorepo). Mantenha os tipos sincronizados
manualmente e documente a rota no controller ou route.

Prefira `interface` exportada a `any` em parametros de service, controller e hook.

## Schema Validation

Use `validate` (em `backend/functions/src/shared/middlewares/validate.ts`) para
validar payloads de entrada com yup:

```ts
import { validate } from "../../shared/middlewares/validate";
import { checkoutPixSchema } from "../schemas/checkoutPixSchema";

router.post("/checkout/pix", validate(checkoutPixSchema), controller.criar);
```

O middleware usa `stripUnknown: true` e `abortEarly: false` para reportar todos
os erros de uma vez.

## Logging E Erros

Use logger com prefixo `[NomeDoModulo]` padronizado em todas as camadas.
Nao logue dados sensiveis (senhas, tokens de acesso, links de reset completos).

Erros devem usar uma classe `AppError` centralizada com:
- codigo interno (UPPER_SNAKE, ex: `PIX_NOT_CONFIRMED`);
- mensagem estavel para o cliente;
- status HTTP correspondente;
- erro original preservado para log interno.

Um middleware `(err, req, res, next)` global captura erros nao tratados e
garante resposta JSON consistente.

## Comentarios No Codigo

Comente apenas o que ajuda manutencao. Nao comente o obvio linha a linha.

Situacoes que merecem comentario:

- **regra de negocio**: explicar o "por que" de uma decisao, nao o "o que";
- **decisao de arquitetura**: por que escolheu este padrao e nao outro;
- **fallback temporario**: marcar com `// TEMP: <motivo>` e vincular a issue;
- **compatibilidade legada**: porque um campo antigo ainda precisa existir;
- **integracao externa**: contrato esperado do provedor (mas sem expor chave);
- **ponto nao obvio**: algoritmo, formula ou condicao que parece errada mas esta certa.

Nao comente:
- nomes de variaveis ou funcoes auto-explicativas;
- chamadas de API padrao ou obvias;
- blocos de codigo que repetem a documentacao do framework.

## Barrel Policy

Cada feature pode ter UM unico `index.ts` barrel na raiz, exportando apenas
o componente ou hook publico (ex: `PremiosTab`, `TesourariaShell`).

Subpastas (`components/`, `hooks/`, `utils/`, `services/`, `types/`) NAO
devem ter barrels. Todos os imports internos sao por caminho direto.

Isso vale para frontend e backend.

## Security Middlewares

O backend usa:

- **helmet** — headers de seguranca HTTP (configurado em `index.ts`);
- **express-rate-limit** — 60 req/min global, 10/min auth routes, 30/min webhook;
- **validateToken** — autenticacao Firebase Auth;
- **requireTesourariaOrAdmin** — verificacao de cargo para rotas administrativas.

Nao remova ou reduza rate limits sem autorizacao explicita.

## SUPER_ADMIN

Nao hardcode emails de super-admin no codigo. Use `process.env.SUPER_ADMIN_EMAILS`
(env var do Firebase runtime config) com fallback para Firestore
(`configuracoes/sistema`). Implementado em `authMiddleware.ts`.

## Utilitarios Compartilhados

Funcoes de uso generico DEVEM ficar em `shared/utils/`, nao duplicadas por feature:

- `formatarMoeda`, `formatarData` → `shared/utils/formatadores.ts`;
- `sanitizarNome`, `sanitizarTelefone` → ja existem em `shared/utils/sanitizadores.ts`.

Se uma funcao existe em 2+ features, mova para `shared/utils/` antes de criar a
terceira ocorrencia. Cores e tokens de design compartilhados DEVEM migrar para
`shared/tokens/` conforme o padrao de `frontend/src/features/aderidos/tokens/`.

## Hierarquia Dos Guias

Use o AGENTS mais especifico do caminho em que estiver trabalhando:

```txt
sistema-rifas/
├── AGENTS.md
├── frontend/
│   ├── AGENTS.md
│   └── src/features/<feature>/AGENTS.md
└── backend/
    ├── AGENTS.md
    └── functions/
        ├── src/
        │   ├── AGENTS.md
        │   └── modules/<modulo>/AGENTS.md
        └── tests/AGENTS.md
```

Guias de modulo existem quando o dominio tem regras proprias. Eles complementam, mas nao substituem, as regras globais. Leia o guia mais especifico primeiro; depois suba para os pais se precisar de contexto adicional.

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
