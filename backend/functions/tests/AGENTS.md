# AGENTS.md - Backend Functions Tests

## Escopo

Este guia vale para `backend/functions/tests/`.

Os testes protegem o codigo em `backend/functions/src` e devem espelhar dominio e camada sempre que possivel.

## Estrutura

Padrao esperado:

```txt
tests/<dominio>/
├── controllers/
├── helpers/
├── routes/
└── services/
```

Nem todo dominio precisa de todas as pastas. Crie apenas quando houver teste real para aquela camada.

## Routes

Testes de routes devem:

- usar Supertest;
- montar um app Express pequeno;
- mockar controllers e middlewares quando o objetivo for validar roteamento;
- validar metodo, path, status e payload esperado;
- incluir middlewares relevantes quando eles fazem parte do contrato da rota.

Nao teste regra de negocio pesada em route spec.

## Controllers

Testes de controllers devem:

- mockar services ou fachadas do dominio;
- validar status HTTP e JSON;
- cobrir sucesso e falha do service;
- manter mensagens HTTP estaveis quando o frontend depende delas;
- usar helpers de `req/res` quando o dominio ja tiver esse padrao.

## Services

Testes de services devem:

- mockar Firestore/Admin SDK;
- nao chamar Firebase real;
- nao usar emulador salvo pedido explicito;
- testar consultas, normalizacao, cenarios vazios e erros relevantes;
- evitar dependencia de ordem quando o contrato nao exige ordenacao.

## Helpers

Testes de helpers devem:

- testar regra pura sem Firebase, Express ou rede;
- cobrir edge cases de parsing, agrupamento, calculo e fallback;
- ser preferidos quando a regra pode ser separada do service.

## Middlewares

Testes de middlewares devem:

- montar `Request`, `Response` e `NextFunction` mockados;
- cobrir ausencia de token, token invalido, token valido e permissoes;
- mockar Firebase Auth/Firestore quando necessario.

Ao mockar middlewares em testes de rota, exporte todos os middlewares usados
pela rota:

```ts
jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
  requireTesourariaOrAdmin: (_req: any, _res: any, next: any) => next(),
}));
```

## Mocks E Dados

- Nao usar dados reais, credenciais, service accounts ou exports locais.
- Nao acessar provedores externos.
- Nao depender de rede.
- Mantenha fixtures pequenos e legiveis dentro do proprio teste ou helper local.
- Prefira mocks nomeados como `mockGet`, `mockWhere`, `mockService`.

## Comandos

Rodar a suite:

```bash
cd backend/functions
npm test
```

Quando alterar TypeScript em `src` ou testes tipados:

```bash
cd backend/functions
npm run build
npm test
```

## Testes de Transacao (ACID)

Tests de services que usam `runTransaction` devem cobrir:

- **fluxo de sucesso**: verifica commit e estado final dos documentos;
- **rollback em erro**: simula falha e verifica que nenhum documento foi alterado;
- **condicao de concorrencia**: quando viavel, simule conflito de transacao.

Nao teste o Firestore Transaction em si — teste a logica DENTRO dela.

## Testes de Contrato

Para endpoints consumidos pelo frontend, adicione teste que valida o schema do
response: campos obrigatorios, tipos, valores minimos/maximos.

Isso protege contra mudancas acidentais no payload da API que quebrariam o frontend.

## Cobertura Minima

Ao criar ou alterar um modulo, garanta:

- todo controller tem ao menos um teste de sucesso e um de falha;
- todo service tem teste com mock do Firestore;
- toda rota nova tem teste de integracao com Supertest;
- helper com regra nao trivial tem teste puro sem dependencias.

Nao remova teste sem cobertura equivalente em outro lugar.

## Cuidados

- Nao remova teste sem cobertura equivalente.
- Atualize testes quando alterar endpoint, payload, erro, permissao ou regra de negocio.
- Se Supertest falhar no sandbox com `EPERM` ao abrir listener local, rerode com permissao apropriada em vez de alterar o teste.
- Logs esperados de erro podem aparecer em testes de falha; silencie apenas quando isso melhorar legibilidade sem esconder comportamento.
