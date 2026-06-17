# AGENTS.md - Secretaria

## Escopo

Este guia vale para tudo dentro de `frontend/src/features/secretaria`.

A feature Secretaria cobre a gestao de aderidos e membros da comissao: listagem, cadastro, edicao, importacao/exportacao de dados.

## Arquitetura

```
secretaria/
├── AGENTS.md
├── index.ts                         (barrel: export SecretariaView)
├── SecretariaView.tsx               (orquestrador — switch desktop/mobile + modais + snackbar)
│
├── components/
│   ├── desktop/
│   │   ├── SecretariaDesktopView.tsx         (split pane: tabela + painel fixo à direita)
│   │   ├── SecretariaDesktopFilterBar.tsx    (pesquisa compacta)
│   │   ├── SecretariaDesktopBatchBar.tsx     (barra de ações em lote)
│   │   └── SecretariaDesktopDetailPane.tsx   (painel de detalhes fixo, não Drawer)
│   ├── mobile/
│   │   ├── SecretariaMobileView.tsx          (cards + FAB + filtros rápidos)
│   │   ├── SecretariaMobileFAB.tsx           (floating action button)
│   │   ├── SecretariaMobileFilterChips.tsx   (legado; não usar em novas telas)
│   │   └── SecretariaMobileSwipeableCard.tsx (card estático que abre detalhes)
│   └── shared/
│       ├── SecretariaHeader.tsx         (titulo + contagem + botao Nova Adesao; prop showButton)
│       ├── SecretariaTipoUsuarioTabs.tsx (tabs Aderidos/Comissão abaixo do resumo)
│       ├── SecretariaFilterBar.tsx      (pesquisa simples reutilizável)
│       ├── SecretariaTable.tsx          (tabela com colunas ordenaveis + checkboxes opcionais)
│       ├── SecretariaCardList.tsx       (cards simplificados com status dot)
│       ├── ResumoSecretariaCards.tsx    (cards de resumo)
│       ├── ImportacaoCard.tsx           (import/export CSV/ZIP)
│       ├── SecretariaDetailPanel.tsx    (Drawer para detalhes, usado apenas em fallback)
│       ├── SkeletonSecretariaList.tsx   (skeleton loading)
│       ├── CargoChip.tsx
│       ├── StatusChip.tsx
│       ├── ModalidadeChip.tsx
│       ├── ModalAdicionarAderido.tsx
│       └── ModalDetalhesAderido.tsx     (Dialog para detalhes em mobile)
│   └── detalhesAderido/
│       ├── FormEditarAderido.tsx
│       ├── InformacoesAderidoCard.tsx
│       ├── InfoItem.tsx
│       └── ResumoOperacionalAderido.tsx
│
├── hooks/
│   ├── useSecretariaController.ts    (controller — dados, cache, modais, notificacao, selecao batch)
│   ├── useSecretariaKeyboard.ts      (atalhos de teclado: Ctrl+F, N, Escape)
│   └── useSecretariaSort.ts          (ordenacao por coluna)
│
├── services/
│   └── secretariaService.ts          (Consumo exclusivo via fetchAPI REST do Backend, zero Firebase Web SDK)
│
├── styles/
│   ├── index.ts
│   ├── surfaces.ts
│   └── layout.ts
│
├── types/
│   └── index.ts                      (tipos locais + re-export de shared)
│
├── utils/
│   ├── calcularResumoSecretaria.ts
│   ├── filtrarAderidos.ts
│   └── formatadoresSecretaria.ts
│
└── mappers/
    └── secretariaMapper.ts
```

## Views Desktop/Mobile

As views de desktop e mobile são **intencionalmente diferentes** para aproveitar cada plataforma.

`SecretariaView.tsx` orquestra o switch usando `usePremiosLayout`.

### Desktop — Layout "Gerenciador" (split pane)

```
Resumo superior
Tabs Aderidos/Comissão abaixo do resumo
Pesquisa compacta
├───────────────────────────┬──────────────┐
│  Tabela (checkboxes)      │  Painel fixo │
│  ↑↓ navega, Enter abre    │  de detalhes │
│  Hover: highlight linha    │  (400px)     │
├───────────────────────────┴──────────────┤
│  BatchBar (selecionados: N)              │
```

- `SecretariaDesktopView` renderiza FilterBar + Table + BatchBar + DetailPane num flex container
- `SecretariaDesktopFilterBar` exibe apenas pesquisa textual
- `SecretariaDesktopDetailPane` é coluna fixa à direita (não Drawer). Mostra placeholder "Selecione um aderido" quando vazio
- `SecretariaTable` com checkboxes (`selectable`, `selectedIds`, `onToggleSelect`, `onSelectAll`)
- `SecretariaDesktopBatchBar` aparece quando `selectedIds.size > 0`
- Ações em lote: exportar selecionados (stub)
- `SecretariaHeader` exibe botão "Nova Adesão" (`showButton` padrão `true`)

### Mobile — Experiência "Touch-first"

```
Tabs abaixo do resumo
Search
├── Card clicável ──────┤
│ Avatar Nome           │
│ Email   [Cargo]       │
├───────────────────────┤
│ ...                   │
│                 [FAB] │  ← adicionar aderido
```

- `SecretariaMobileView` renderiza search + cards + FAB
- `SecretariaMobileFilterChips` é legado; não reintroduza filtros rápidos sem nova decisão de produto
- `SecretariaMobileSwipeableCard` — card estático; clique abre detalhes. Editar/excluir ficam no painel/modal de detalhes
- `SecretariaMobileFAB` substitui o botão "Nova Adesão" do header no mobile
- `SecretariaHeader` com `showButton={false}` no mobile
- Não há BottomSheet de filtros na experiência atual
- `ModalDetalhesAderido` (Dialog) para detalhes em mobile (não bottom sheet por legibilidade)
- `pb: 10` no container da lista para evitar sobreposição do FAB

## Hooks

- `useSecretariaController` — gerencia estado, carregamento, notificacoes (snackbar), adicao/atualizacao, **selecao batch**: `selectedIds`, `toggleSelectId`, `toggleSelectAll`, `limparSelecao`
- `useSecretariaKeyboard` — registra atalhos: `Ctrl+F` foca busca, `N` abre nova adesao, `Escape` fecha painel/modal
- `useSecretariaSort` — retorna `{ sorted, sortBy, sortDir, toggleSort }` para ordenar colunas da tabela

## Componentes

- Componentes em `shared/` recebem dados e callbacks por props, nunca hooks
- Componentes em `desktop/` são exclusivos do layout split pane
- Componentes em `mobile/` são exclusivos da experiência touch
- `ModalDetalhesAderido` é usado apenas no mobile (Dialog); desktop usa `SecretariaDesktopDetailPane` (painel fixo)
- `ModalAdicionarAderido` recebe `onConfirm` por prop
- `SecretariaHeader` aceita `showButton?: boolean` (default `true`) — falso no mobile (FAB substitui)
- `SecretariaTable` aceita `selectable`, `selectedIds`, `onToggleSelect`, `onSelectAll` para batch selection
- `SecretariaCardList` versão simplificada com status dot (círculo colorido) em vez de StatusChip
- `SecretariaDesktopDetailPane` renderiza placeholder "Selecione um aderido" quando `aderido === null`
- Detalhes de leitura usam `InformacoesAderidoCard`: um único card hierárquico, sem grade de vários cards de informação

## Notificacoes

Use snackbar (via `useSecretariaController`) em vez de `alert()`:
- sucesso: "Aderido autorizado com sucesso!"
- erro: exibir mensagem do erro
- feedback de salvamento: "Dados atualizados com sucesso!"

## Atalhos de Teclado

- `Ctrl+F` — foca o campo de busca
- `N` — abre modal de nova adesao
- `Escape` — fecha painel lateral ou modal aberto

## Testes

Testes em `frontend/tests/features/secretaria/` espelham a estrutura do src.

Cubra:
- controller com carregamento, adicao, atualizacao e notificacao
- sort com ordenacao asc/desc/reset
- keyboard com disparo de atalhos
- views desktop/mobile com renderizacao condicional
- shared components com props e callbacks

## Comandos

```bash
cd frontend
npm run test:run -- tests/features/secretaria
npm run build
```
