# AGENTS.md - Premios

## Escopo

Este guia vale para tudo dentro de `frontend/src/features/premios`.

A feature Premios cobre a vitrine de premios do sorteio, CRUD pela administracao e exibicao para aderidos.

## Arquitetura

```
premios/
├── AGENTS.md
├── index.ts                    (barrel: export PremiosTab)
├── PremiosTab.tsx              (orquestrador — switch desktop/mobile + dialogs)
│
├── components/
│   ├── desktop/
│   │   ├── HeroPremioCard.tsx      (destacado 1o lugar — flexDirection row)
│   │   └── PremiosDesktopView.tsx  (layout completo para desktop)
│   ├── mobile/
│   │   ├── HeroPremioCard.tsx      (destacado 1o lugar — layout coluna, sem distorcao)
│   │   └── PremiosMobileView.tsx   (layout completo para mobile)
│   └── shared/
│       ├── HeroBanner.tsx          (banner do sorteio com countdown)
│       ├── PremioCard.tsx          (card comum de premio)
│       ├── PremioSkeleton.tsx      (skeleton loading)
│       ├── HeaderForm.tsx          (modal de edicao do cabecalho)
│       └── PrizeForm.tsx           (modal de cadastro/edicao de premio)
│
├── hooks/
│   ├── usePremios.ts               (camada fina que chama service)
│   ├── usePremiosController.ts     (controller — estado, modais, loading)
│   └── usePremiosLayout.ts         (detecção mobile/desktop via useMediaQuery)
│
├── services/
│   └── premiosService.ts           (fetchAPI + delega upload para storageService)
│
├── styles/                         (design tokens sx)
│   ├── colors.ts
│   ├── typography.ts
│   ├── surfaces.ts
│   ├── components.ts
│   └── layout.ts
│
├── types/
│   ├── premio.ts                (PremioData)
│   └── sorteio.ts               (InfoSorteio)
│
└── utils/
    └── dateUtils.ts             (formatarDataExtenso, calcularDiasRestantes)
```

## Componentes

### Shared (usados em ambas as views)

- `HeroBanner` — cabecalho do sorteio com titulo, data formatada, countdown e descricao
- `PremioCard` — card de premio comum (colocacao, imagem, titulo, descricao)
- `PremioSkeleton` — placeholder de loading com skeletons
- `HeaderForm` — dialog de edicao do cabecalho do sorteio
- `PrizeForm` — dialog de cadastro/edicao de premio com upload de imagem

### Desktop

- `HeroPremioCard` — card destacado para 1o lugar com `flexDirection: "row"` (imagem 280px à esquerda, conteúdo alinhado à esquerda)
- `PremiosDesktopView` — layout completo: banner + header "Prêmios" + card hero + grid de cards

### Mobile

- `HeroPremioCard` — card destacado em coluna, imagem centrada com `maxWidth: 320`, sem esticar
- `PremiosMobileView` — layout completo com `mb` reduzido entre secoes

## Hooks

- `usePremios` — camada fina que expoe metodos do service
- `usePremiosController` — controller que gerencia estado, modais, carregamento e salvamento
- `usePremiosLayout` — retorna `{ isMobile, isDesktop }` via `useMediaQuery(theme.breakpoints.down("md"))`

## Services

- `premiosService` — metodos: `buscar`, `salvarInfoSorteio`, `salvarPremio`, `excluir`, `uploadImagem` (delega para `storageService.uploadImagem` do shared)

## Types

- `PremioData` — `{ id?, colocacao?, titulo?, descricao?, imagem_url? }`
- `InfoSorteio` — `{ titulo, data, descricao }`

## Utils

- `formatarDataExtenso(dataIso)` — converte ISO para "11 de Junho de 2026"
- `calcularDiasRestantes(dataIso)` — retorna numero de dias ou null

A funcao `ehPrimeiroLugar` foi inlinada no unico consumidor (`PremiosTab.tsx`).

## Estilos

A pasta `styles/` centraliza objetos sx reutilizaveis. Prefira `import { colors } from "../styles/colors"` e use `sx={{ ...surfaces.premioCard, ...typography.bannerTitulo }}`.

Nao coloque logica de estilo condicional complexa em `styles/`. Nao importe `styles/` de hooks, services ou utils.

### Keys removidas

As seguintes keys nunca usadas foram removidas: `typography.premioTitulo`, `typography.descricao`, `surfaces.paper`, `surfaces.paperComSombra`, `components.chipColocacao`, `layout.loadingContainer`.

## Padroes

- Componentes recebem dados e callbacks por props
- Use `Paper elevation={0}`, bordas leves, radius `2` a `2.25`, fundo suave
- Use as paletas definidas em `styles/colors.ts` em vez de hex ou CSS vars globais
- Siga o sistema de motion dos tokens de `aderidos/tokens/motion.ts` (cubic-bezier, `reduceMotionSx`)
- Desktop e mobile tem views separadas em `components/desktop/` e `components/mobile/`
- Componentes compartilhados ficam em `components/shared/`
- Nao crie barrels em subpastas — o unico barrel permitido e o `index.ts` raiz da feature
- `PremiosTab.tsx` usa `usePremiosLayout` para detectar mobile e renderizar a view correspondente
- Estado vazio usa `EmptyState` de `@/shared/components/EmptyState` em vez de componente local

## Testes

```txt
tests/features/premios/
├── components/
│   ├── HeroBanner.test.tsx
│   ├── HeroPremioCard.test.tsx
│   ├── PremioCard.test.tsx
│   ├── PremioSkeleton.test.tsx
│   └── PremiosTab.test.tsx
└── hooks/
    └── usePremios.test.tsx
```

## Comandos recomendados

```bash
cd frontend
npm run build
npm run test:run -- tests/features/premios
```
