# AGENTS.md - Aderidos

## Escopo

Este guia vale para tudo dentro de `frontend/src/features/aderidos`.

A feature Aderidos cobre o painel de rifas do aderido, seleção de rifas, checkout Pix via backend do sistema, notificações e correção de dados.

### Nota sobre a feature `rifas`

O codigo ativo da antiga `features/rifas` (`buscarMinhasRifas`, `corrigirDadosRifasRecusadas`) foi movido para `services/aderidoRifaService.ts`. O restante da feature `rifas` (fluxo antigo de venda direta com upload, `rifasStorageService`, hook `useRifas`) está em `features/rifas/legacy/`. Nao importe de `features/rifas/` diretamente.

## Arquitetura

```
aderidos/
├── AGENTS.md
├── index.ts                          (barrel: export MinhasRifasTab)
├── MinhasRifasTab.tsx                (orquestrador — switch desktop/mobile + dialogs)
├── AbaRecusadas.tsx
├── CarrinhoFlutuante.tsx
├── CheckoutModal.tsx
├── EstatisticasAderido.tsx
├── ModalCorrecaoRecusa.tsx
├── ModalDetalhesRifa.tsx
├── PainelRecusado.tsx                (componente legacy de vendas recusadas)
│
├── components/
│   ├── desktop/
│   │   └── MinhasRifasDesktopView.tsx   (layout completo para desktop)
│   ├── mobile/
│   │   └── MinhasRifasMobileView.tsx    (layout completo para mobile)
│   ├── shared/                          (componentes usados em ambas as views)
│   ├── BlocoVendasHeader.tsx
│   ├── EmptyRifasState.tsx
│   ├── FiltrosRifas.tsx
│   ├── GrelhaRifas.tsx
│   ├── LoadingRifasState.tsx
│   ├── StatusRifasHelpDialog.tsx
│   ├── checkout/
│   ├── detalhesRifa/
│   └── resumo/
│
├── hooks/
│   ├── usePainelAderidoController.ts     (controller — estado, cache, seleção, modais)
│   ├── useCheckoutFlow.ts
│   ├── useModalStack.ts
│   ├── useRifasData.ts
│   └── useRifasSelection.ts
│
├── services/
│   ├── aderidoRifaService.ts
│   └── checkoutPixService.ts
│
├── styles/                              (objetos sx centralizados)
│   ├── base.ts                          (page, root)
│   ├── components.ts                    (blocoVendasArea, filtros, grid, botoes)
│   ├── feedbackStates.ts                (erro, loading, vazio)
│   └── surfaces.ts                      (carrinho, resumo, header, notificacao)
│
├── tokens/
│   ├── colors.ts
│   ├── index.ts
│   ├── motion.ts
│   └── typography.ts
│
├── types/
│   └── painelAderido.ts
│
└── utils/
    ├── agruparRifasRecusadas.ts
    ├── calcularResumoRifas.ts
    ├── constants.ts                     (SANITIZE_LIMITES removido)
    ├── errorsPix.ts
    ├── obterDicaCorrecaoRecusa.ts
    ├── obterPrimeiroNomeAderido.ts
    ├── rifasStatus.ts
    └── validadores.ts
```

- `components`: UI pura. Componentes recebem dados/callbacks por props e não chamam backend.
- `hooks`: orquestração de tela, cache, estados locais, seleção, modais e callbacks.
- `services`: chamadas ao backend do sistema. Nunca chamar provedor financeiro direto pelo frontend. Atualmente: `checkoutPixService.ts` (criar cobranca Pix) e `aderidoRifaService.ts` (buscar rifas, corrigir dados).
- `types`: contratos TypeScript do domínio.
- `utils`: regras puras, agrupamentos, filtros. Formatadores removidos — usar `@/shared/utils/formatadores`.
- `styles`: estilos por área visual. Evite arquivos grandes; divida por resumo, rifas, carrinho ou checkout quando crescer.
- `tokens`: design tokens primitivos (colors, typography, motion) para uso em arquivos de estilo.

Não crie pasta `controllers` nesta feature.

## Views Desktop/Mobile

`MinhasRifasTab.tsx` orquestra o switch entre `MinhasRifasDesktopView` e `MinhasRifasMobileView` usando `usePremiosLayout` (importado de `../premios/hooks/usePremiosLayout`). Ambos os componentes recebem os mesmos estados e callbacks do controller e renderizam dialogs (CheckoutModal, NotificacoesSidebar, ModalCorrecaoRecusa, ModalDetalhesRifa) no nível do orquestrador.

O layout visual atual é idêntico entre as duas views (responsivo via sx breakpoints); a separação existe como estrutura para futuras divergências de UX.

## Utilitários Removidos

Os seguintes arquivos foram removidos em favor de `@/shared/utils/`:

- `utils/sanitizadores.ts` → usar `@/shared/utils/sanitizadores`
- `utils/formatadoresAderido.ts` → usar `@/shared/utils/formatadores`
- `utils/mascaras.ts` → usar `@/shared/utils/formatadores` (`formatarTelefone`)
- `hooks/useKeyboardHeight.ts` → usar `@/shared/hooks/useKeyboardHeight`
- `utils/constants.ts`: `SANITIZE_LIMITES` removido (sem consumidores)

## Cache E Dados

- Use TanStack Query para dados remotos do painel quando houver cache/invalidação.
- Query keys devem incluir feature e usuário, por exemplo:
  - `["aderidos", "minhas-rifas", userId]`;
  - `["aderidos", "notificacoes", userId]`.
- Invalide cache após checkout concluído, correção de dados e leitura de notificações.
- Mantenha seleção, filtros, modal aberto e detalhes como estado local do hook.

## UI E Fluxos

- Aderidos pode espelhar a linguagem visual da Tesouraria, mas não deve importar componentes da feature Tesouraria.
- Use `Paper elevation={0}`, bordas leves, radius entre `2` e `2.25`, fundo suave e a paleta definida em `frontend/AGENTS.md`.
- Status `pendente`/`Em análise` deve usar amarelo suave.
- Correção por negação da tesouraria significa corrigir dados, sem upload obrigatório no fluxo novo.
- Notificações legadas sem tipo devem continuar compatíveis.

## Checkout Pix

- O frontend chama apenas o backend do sistema.
- O contrato preparado de Pix fica em service/type da feature, sem expor credenciais ou nomes de provedor na UI.
- Se o endpoint ainda não estiver disponível, mostrar estado de erro/indisponibilidade controlado.

## Testes

Espelhe `src` em `tests/features/aderidos`.

Cubra:

- hooks com cache, loading, invalidação e erro;
- services com endpoint/payload esperado;
- componentes por comportamento visível;
- utils com entradas e saídas determinísticas;
- checkout e correção sem upload obrigatório.

Comandos recomendados:

```bash
cd frontend
npm run test:run -- tests/features/aderidos
npm run build
```
