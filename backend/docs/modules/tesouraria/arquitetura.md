# Arquitetura Da Tesouraria

## Objetivo

Explicar a organizacao interna do modulo de tesouraria e como uma requisicao
percorre as camadas ate chegar ao Firestore.

## Arquivos Envolvidos

| Camada | Arquivos |
| --- | --- |
| Registro global | `backend/functions/src/routes.ts` |
| Router do modulo | `tesourariaRoutes.ts` |
| Subrotas | `routes/relatorioTesourariaRoutes.ts`, `routes/pixTransacoesRoutes.ts` |
| Controllers | `controllers/*Controller.ts`, `tesourariaController.ts` |
| Services | `tesourariaService.ts`, `services/*.ts` |
| Helpers | `helpers/*.ts` |
| Contratos | `types/tesourariaTypes.ts` |

## Fluxo

1. `src/routes.ts` registra `router.use("/tesouraria", tesourariaRoutes)`.
2. `tesourariaRoutes.ts` compoe as rotas de relatorio/historico e Pix.
3. Cada arquivo em `routes/` aplica `validateToken` e `requireTesourariaOrAdmin`.
4. A rota chama um handler em `tesourariaController`.
5. O handler especializado chama `TesourariaService`.
6. `TesourariaService` delega para `TesourariaRelatorioService` ou `PixTransacoesService`.
7. O service acessa Firestore via `firebase-admin`.
8. Helpers puros normalizam regras como agrupamento, status e resumo Pix.
9. O service retorna dados normalizados para o controller.

## Imports E Dependencias

| Import | Onde aparece | Motivo |
| --- | --- | --- |
| `Router` de `express` | `tesourariaRoutes.ts`, `routes/*.ts` | Montar rotas Express sem acoplar ao app principal. |
| `AuthRequest` | Controllers | Tipar requisicoes autenticadas de forma consistente. |
| `validateToken` | Rotas | Verificar token Firebase antes de expor dados financeiros. |
| `requireTesourariaOrAdmin` | Rotas | Restringir relatorios e Pix a cargos autorizados. |
| `firebase-admin` | Services | Ler Firestore com privilegios backend. |
| `Bilhete`, `Usuario` | Services | Tipar documentos persistidos nas colecoes atuais. |
| `pixTransacoesHelper` | Pix service | Executar regras puras sem acoplar Firestore. |

## Funcoes E Metodos

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `router.use(relatorioTesourariaRoutes)` | Monta relatorio e historico. | Router Express | Rotas adicionadas | Prefixo final vem de `/tesouraria`. |
| `router.use(pixTransacoesRoutes)` | Monta rotas Pix. | Router Express | Rotas adicionadas | Mantem Pix isolado de relatorio. |
| `tesourariaController` | Agrega handlers HTTP. | Funcoes importadas | Objeto de controllers | Evita imports longos nas rotas. |
| `TesourariaService` | Facade da camada de dominio. | Chamadas dos controllers | Dados prontos para JSON | Centraliza o contrato interno. |
| `pixTransacoesHelper` | Regras puras Pix. | Bilhetes/transacoes | Dados normalizados | Nao acessa Firestore. |

## Regras E Cuidados

- Controllers nao devem acessar Firestore diretamente.
- Services nao devem depender de `Response` ou detalhes HTTP.
- Helpers nao devem acessar Firestore, Express ou Firebase Admin.
- Rotas financeiras amplas sempre usam autenticacao e permissao.
- A pasta `legacy/` nao deve ser base para codigo novo.
- O modulo usa dados locais; nao ha chamada a provedor Pix.

## Testes Relacionados

- `backend/functions/tests/tesouraria/routes/tesourariaRoutes.spec.ts`
- `backend/functions/tests/tesouraria/controllers/*.spec.ts`
- `backend/functions/tests/tesouraria/services/pixTransacoesService.spec.ts`
