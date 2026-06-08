# Tesouraria Backend

## Objetivo

Documentar o modulo backend de tesouraria, responsavel por relatorios
financeiros, historico/auditoria de compras e transacoes Pix derivadas dos
dados locais de rifas.

O modulo nao chama provedor externo de banco/Pix. Hoje ele normaliza dados das
colecoes `bilhetes` e `usuarios` usando Firebase Admin SDK.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Entrada do modulo | `tesourariaRoutes.ts`, `tesourariaController.ts`, `tesourariaService.ts` |
| Rotas | `routes/relatorioTesourariaRoutes.ts`, `routes/pixTransacoesRoutes.ts` |
| Controllers | `controllers/*Controller.ts` |
| Services | `services/tesourariaRelatorioService.ts`, `services/pixTransacoesService.ts` |
| Tipos | `types/tesourariaTypes.ts` |
| Legado | `legacy/auditoria/*` |

## Fluxo

```txt
src/routes.ts
  -> /tesouraria
    -> tesourariaRoutes
      -> routes/*
        -> tesourariaController
          -> controllers/*
            -> TesourariaService
              -> services/*
                -> Firestore/Admin SDK
```

Aliases financeiros antigos em `rifas` tambem delegam para tesouraria:

```txt
/rifas/relatorio -> tesourariaController.obterRelatorioTesouraria
/rifas/historico -> tesourariaController.obterHistoricoTesouraria
```

## Imports E Dependencias

| Dependencia | Uso |
| --- | --- |
| `express` | Cria routers e tipos HTTP dos controllers. |
| `firebase-admin` | Acessa Firestore pelo Admin SDK. |
| `AuthRequest` | Garante acesso ao usuario autenticado quando necessario. |
| `validateToken` | Protege rotas autenticadas. |
| `requireTesourariaOrAdmin` | Restringe dados financeiros amplos para tesouraria/admin. |
| `Bilhete`, `Usuario` | Tipos base compartilhados do dominio. |
| `tesourariaTypes` | Contratos Pix retornados pelos endpoints. |

## Funcoes E Metodos

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `tesourariaRoutes` | Agrupa subrotas do dominio. | Requisicoes `/tesouraria/*` | Router Express | Registrado em `src/routes.ts`. |
| `tesourariaController` | Facade de handlers HTTP. | `AuthRequest`, `Response` | JSON HTTP | Reexporta controllers especializados. |
| `TesourariaService` | Facade da regra de negocio. | Chamadas de controllers | Dados normalizados | Delega para services especificos. |
| `TesourariaRelatorioService` | Relatorio e historico financeiro. | Firestore local | Relatorio/historico | Usa `usuarios` e `bilhetes`. |
| `PixTransacoesService` | Transacoes Pix locais. | Firestore local | `PixTransacao[]`, resumo, sync no-op | Nao chama provedor externo. |

## Regras E Cuidados

- Rotas canonicas usam prefixo `/tesouraria`.
- Dados financeiros amplos exigem `validateToken` e `requireTesourariaOrAdmin`.
- `/rifas/relatorio` e `/rifas/historico` permanecem como aliases de compatibilidade.
- Nao duplicar regra financeira em `rifas`; use delegacao para tesouraria.
- Nao usar nome de provedor externo como dominio canonico.
- Nao criar integracao direta com banco/Pix sem autorizacao explicita.

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| Rotas | `backend/functions/tests/tesouraria/routes/tesourariaRoutes.spec.ts` |
| Controllers | `backend/functions/tests/tesouraria/controllers/*.spec.ts` |
| Services | `backend/functions/tests/tesouraria/services/pixTransacoesService.spec.ts` |
| Compatibilidade rifas | `backend/functions/tests/rifas/routes/relatorioRifasRoutes.spec.ts` |
| Legacy auditoria | `backend/functions/tests/auditoria/*.spec.ts` |

## Leitura Complementar

- [Arquitetura](arquitetura.md)
- [API](api.md)
- [Services](services.md)
- [Legacy Auditoria](legacy-auditoria.md)
