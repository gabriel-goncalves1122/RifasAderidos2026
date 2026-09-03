# Modulo Tesouraria (Financeiro, Pix, Auditoria)

## Objetivo

Modulo de gestao financeira: visualizacao de transacoes Pix, aprovacao/rejeicao
de pagamentos, auditoria de compras, conciliacao, desempenho e metricas
operacionais. E o maior modulo do frontend.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Paginas | `pages/TesourariaPixPage.tsx`, `pages/AuditoriaComprasPage.tsx`, `pages/DesempenhoPage.tsx`, `pages/TesourariaPage.tsx` |
| Layout | `components/layout/TesourariaShell.tsx` (mobile/desktop branching) |
| Pix | `components/pix/tabs/`, `components/pix/transacoes/`, `components/pix/layout/` |
| Auditoria | `components/auditoriaCompras/desktop/`, `components/auditoriaCompras/mobile/`, `components/auditoriaCompras/shared/` |
| Desempenho | `components/desempenho/` |
| Hooks | `hooks/usePixController.ts`, `hooks/usePixTransacoes.ts`, `hooks/useAuditoriaComprasController.ts`, `hooks/useDesempenhoController.ts` |
| Services | `services/pixTransacoesService.ts`, `services/auditoriaComprasService.ts`, `services/desempenhoService.ts` |
| Estilos | `styles/colors.ts`, `styles/surfaces.ts`, `styles/typography.ts`, `styles/components.ts`, `styles/layout.ts` |
| Utils | `utils/formatadores.ts`, `utils/constants.ts`, `utils/pixTransacoesUtils.ts`, `utils/auditoriaComprasUtils.ts` |
| Tipos | `types/pixTransacoes.ts`, `types/auditoriaCompras.ts`, `types/desempenho.ts` |
| Legado | `legacy/` (compat/ e ia/) |

## Fluxo (Pagina Pix)

```txt
TesourariaPixPage
  -> TesourariaShell
    -> PixHeader (sincronizar, periodo)
    -> PixTabs (VisaoGeral, Transacoes, Conciliacao, Aderidos)
      -> PixVisaoGeralTab (metricas, grafico temporal, KPIs)
      -> PixTransacoesDesktopView / PixTransacoesMobileView
        -> PixTransacoesFiltros
        -> PixTransacoesTable / PixTransacaoCard
        -> PixTransacaoDetalhesDialog
      -> PixConciliacaoTab
      -> PixAderidosTab
        -> PixAderidoResumoCard
        -> PixAderidoDetalhesDrawer
```

## Fluxo (Auditoria De Compras)

```txt
AuditoriaComprasPage
  -> AuditoriaComprasFiltrosDesktop / AuditoriaComprasFiltrosMobile
  -> AuditoriaComprasResumo
  -> AuditoriaComprasTable / AuditoriaCompraCard
  -> AuditoriaCompraDetalhesDialog
    -> AuditoriaCompraEdicaoDialog (editar comprador)
    -> AuditoriaCompraActions (reenviar email)
```

## Imports E Dependencias

| Dependencia | Uso |
| --- | --- |
| `@mui/material` | Todos os componentes de UI. Tema global. |
| `@tanstack/react-query` | Cache de transacoes, auditoria e desempenho. |
| `recharts` | Graficos: `ReceitaAreaChart`, `ResumoBarChart`, `PixRecebimentosTemporalChart`. |
| `react-hook-form` | Formulario de edicao de comprador na auditoria. |
| `shared/services/api.ts` | `fetchAPI` para todas as chamadas backend. |

## Componentes E Hooks

| Nome | Responsabilidade | Props Relevantes |
| --- | --- | --- |
| `TesourariaShell` | Layout responsivo (mobile vs desktop) | — |
| `PixHeader` | Sincronizacao e seletor de periodo | `onSincronizar`, `sincronizando` |
| `PixTransacoesTable` | Tabela de transacoes (desktop) | `transacoes`, `onAbrirDetalhes` |
| `PixTransacaoDetalhesDialog` | Dialog com detalhes e acoes de validacao | `transacao`, `onAceitar`, `onNegar` |
| `AuditoriaComprasTable` | Tabela de auditoria (desktop) | `compras`, `onAbrirDetalhes` |
| `AuditoriaCompraEdicaoDialog` | Editar dados do comprador | `compra`, `onSalvar` |
| `DesempenhoKpiCard` | Card de indicador KPI | `titulo`, `valor`, `variacao` |
| `usePixController` | Orquestrador da pagina Pix | — |
| `usePixTransacoes` | Dados, filtros e acoes de transacoes Pix | — |
| `useAuditoriaComprasController` | Dados, filtros e acoes de auditoria | — |
| `useDesempenhoController` | Dados de desempenho | — |

## Regras E Cuidados

- **Estilos centralizados**: usar `styles/` em vez de hex inline ou sx direto.
  Veja [padroes/estilos.md](../padroes/estilos.md).
- **Responsividade**: componentes separados em `desktop/` e `mobile/`. Decisao
  feita por `useMediaQuery` via `useTesourariaLayout`.
- **Mutex sincronizacao**: `disabled={sincronizando}` no `PixHeader` evita
  multiplas requisicoes de sync simultaneas.
- **Sanitizacao**: edicao de comprador em `AuditoriaCompraEdicaoDialog` sanitiza
  dados antes de enviar, usando `shared/utils/sanitizadores.ts`.
- **Telefone**: mascara aplicada em tempo real via `formatarTelefone` com
  `maxLength=15`.
- **Dados Pix sao locais**: modulo nao chapa provedor externo — dados vem
  do Firestore via backend.
- **Legacy**: pasta `legacy/` contem codigo antigo (ia/, compat/). Nao usar
  como base para codigo novo.

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| Pagina Pix | `tests/features/tesouraria/pages/TesourariaPixPage.test.tsx` |
| Pagina Auditoria | `tests/features/tesouraria/pages/AuditoriaComprasPage.test.tsx` |
| Pagina Desempenho | `tests/features/tesouraria/pages/DesempenhoPage.test.tsx` |
| Componentes Pix | `tests/features/tesouraria/components/pix/**/*.test.tsx` |
| Componentes Auditoria | `tests/features/tesouraria/components/auditoriaCompras/**/*.test.tsx` |
| Hooks | `tests/features/tesouraria/hooks/*.test.tsx` |
| Services | `tests/features/tesouraria/services/*.test.ts` |
| Utils | `tests/features/tesouraria/utils/*.test.ts` |
| E2E | `tests/e2e/tesouraria/venda-pix-pendente.spec.ts` |
| Testes legados (deprecados) | `tests/features/tesouraria/legacy_ia/*.tsx` |
