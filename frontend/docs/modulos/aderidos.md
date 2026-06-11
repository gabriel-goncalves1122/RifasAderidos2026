# Modulo Aderidos (Painel Do Vendedor)

## Objetivo

Painel do vendedor estudante ("aderido"). Permite visualizar rifas disponiveis,
selecionar numeros, realizar checkout via Pix, corrigir dados de compras
recusadas e acompanhar arrecadacao.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Entrada | `MinhasRifasTab.tsx`, `AbaRecusadas.tsx`, `EstatisticasAderido.tsx` |
| Componentes | `components/checkout/`, `components/detalhesRifa/`, `components/resumo/` |
| Hooks | `hooks/usePainelAderido.ts`, `hooks/useRifasData.ts`, `hooks/useRifasSelection.ts` |
| Services | `services/checkoutPixService.ts` |
| Estilos | `styles/` (base, components, feedbackStates, painelAderidoStyles, surfaces) |
| Tokens | `tokens/` (colors, typography, motion) |
| Tipos | `types/painelAderido.ts`, `types/checkoutPix.ts` |
| Utils | `utils/constants.ts`, `utils/sanitizadores.ts`, `utils/validadores.ts` |

## Fluxo

```txt
DashboardPage (contexto = aderido)
  -> MinhasRifasTab
    -> EstatisticasAderido (cabecalho com resumo)
    -> GrelhaRifas (grid de rifas)
    -> CarrinhoFlutuante (selecao)
    -> CheckoutModal
      -> CheckoutDadosCompradorForm
      -> CheckoutPixBox (QR code)
    -> AbaRecusadas (correcao)
      -> ModalCorrecaoRecusa
```

## Imports E Dependencias

| Dependencia | Uso |
| --- | --- |
| `@tanstack/react-query` | Cache de rifas e dados do painel. StaleTime: 60s. |
| `firebase/auth` | Token de autenticacao injetado via `fetchAPI`. |
| `react-hook-form` + `yup` | Formulario de checkout e correcao de recusa. |
| `shared/services/api.ts` | `fetchAPI` para todas as chamadas backend. |
| `shared/hooks/useKeyboardHeight.ts` | Ajuste do carrinho em mobile com teclado virtual. |
| `shared/utils/sanitizadores.ts` | Sanitizacao de dados do comprador (nome, email, telefone). |

## Componentes E Hooks

| Nome | Responsabilidade | Props Relevantes |
| --- | --- | --- |
| `MinhasRifasTab` | Orquestra abas (Minhas Rifas, Recusadas, Premios) | — |
| `EstatisticasAderido` | Header com saudacao, arrecadacao e pendencias | — |
| `GrelhaRifas` | Grade de rifas disponiveis para venda | — |
| `CarrinhoFlutuante` | Barra inferior com selecao e botao de checkout | — |
| `CheckoutModal` | Modal de checkout com formulario e Pix | — |
| `ModalCorrecaoRecusa` | Modal para corrigir dados de compra recusada | — |
| `usePainelAderido` | Hook orquestrador: dados, selecao, modais, checkout | — |
| `useRifasData` | Fetch de rifas via TanStack Query | — |
| `useRifasSelection` | Estado de selecao de rifas (toggle, selecionar todas) | — |
| `useCheckoutFlow` | Pos-checkout: invalidacao de queries e limpeza | — |
| `useModalStack` | Gerenciamento de estado de modais/drawers | — |

## Regras E Cuidados

- **Sanitizacao**: dados do comprador (nome, email, telefone) sao sanitizados
  antes de enviar ao backend. Limites: nome 120, email 254, telefone 20 chars.
- **Mutex Pix**: `checkoutPixService.ts` usa mutex booleano para evitar
  duplicidade de requisicao durante criacao de cobranca.
- **Ownership check**: IDs de notificacao so sao enviados ao backend se
  pertencerem ao usuario logado (seguranca contra IDOR).
- **SessionStorage**: nao deve conter PII. Dialog usa `keepMounted` para
  preservar estado entre aberturas.
- **Teclado mobile**: `CarrinhoFlutuante` reage a `useKeyboardHeight` para
  nao ficar atras do teclado virtual.
- **Validacao**: usa `validadores.ts` (funcoes puras, sem Zod) para verificar
  shape minimo de dados de API.

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| Pagina/Abas | `tests/features/aderidos/MinhasRifasTab.test.tsx` |
| Componentes | `tests/features/aderidos/components/*.test.tsx` |
| Checkout | `tests/features/aderidos/components/checkout/*.test.tsx` |
| Hooks | `tests/features/aderidos/hooks/*.test.tsx` |
| Services | `tests/features/aderidos/services/checkoutPixService.test.ts` |
| Utils | `tests/features/aderidos/utils/*.test.ts` |
| Recusadas | `tests/features/aderidos/AbaRecusadas.test.tsx`, `tests/features/aderidos/ModalCorrecaoRecusa.test.tsx` |
