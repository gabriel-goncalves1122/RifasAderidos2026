# AGENTS.md — Frontend

## Escopo

Este arquivo vale para tudo dentro de `frontend/`.

O frontend usa:

- React;
- Vite;
- TypeScript;
- MUI;
- Firebase Web SDK;
- Vitest;
- React Testing Library.

## Regra principal

O frontend deve ser organizado por feature.

Evite criar novas pastas genéricas como `controllers`.

Use:

```txt
hooks      → lógica de estado e integração de tela
services   → chamadas de API e integrações externas via backend
types      → tipos TypeScript
utils      → funções puras e formatadores
components → componentes visuais
pages      → composição de página
styles     → objetos sx centralizados (opcional)
tokens     → design tokens primitivos (opcional)
mocks      → dados temporários de desenvolvimento/teste
legacy     → código legado isolado
```

## Cache De Dados Remotos

Quando uma feature precisar de cache, revalidação ou invalidação de dados remotos, mantenha essa lógica em `hooks` e `services` da própria feature.

Componentes visuais não devem chamar backend nem manipular query keys diretamente.

Prefira query keys explícitas por feature e usuário quando o dado for sensível ao usuário autenticado.

## Naming Convention

Hooks controller seguem o padrão `use<Nome>Controller` (ex: `usePremiosController`, `usePixController`).
Hooks de domínio puro (que apenas expõem operações de service) seguem `use<Nome>` (ex: `usePremios`, `usePixTransacoes`).

Utilitários e services usam camelCase: `pixTransacoesService`, `dateUtils`.
Tipos usam PascalCase: `PremioData`, `PixTransacao`, `InfoSorteio`.

## Barrel Policy

Cada feature pode ter UM único `index.ts` barrel na raiz, exportando apenas
o componente ou hook público (ex: `PremiosTab`, `TesourariaShell`).

Subpastas (`components/`, `hooks/`, `utils/`, `services/`, `types/`) NÃO
devem ter barrels. Todos os imports internos são por caminho direto.

Isto vale para frontend e backend.

## Utilitários Compartilhados

Não duplique formatadores e regras entre features.

Funções de uso genérico DEVEM ficar em `shared/utils/` e não em feature específica:

- `formatarMoeda`, `formatarData` → `shared/utils/formatadores.ts`;
- `sanitizarNome`, `sanitizarTelefone` → já existem em `shared/utils/sanitizadores.ts`.

Se uma função existe em 2+ features, mova para `shared/utils/` antes de criar a
terceira ocorrência.

Cores e tokens de design compartilhados DEVEM migrar para `shared/tokens/`
conforme o padrão de `features/aderidos/tokens/`.

## Motion e Animações

Use os design tokens de motion de `features/aderidos/tokens/motion.ts` em todas
as features:
- `aderidosMotion.easing.easeOut` / `aderidosMotion.easing.easeInOut`;
- `aderidosMotion.duration.short` / `standard` / `medium` / `long`;
- `reduceMotionSx` para acessibilidade (`prefers-reduced-motion: reduce`).

Não defina easing ou duration avulsos; centralize nos tokens.

## Estrutura esperada

```txt
frontend/
├── docs/              # Documentação técnica (arquitetura, módulos, padrões)
├── src/
│   ├── app/
│   ├── shared/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── features/
│   │   ├── aderidos/       # Painel do vendedor + services de rifas (aderidoRifaService)
│   │   ├── auth/
│   │   ├── premios/
│   │   ├── rifas/          # Legacy (codigo antigo de venda direta; so contem legacy/)
│   │   ├── secretaria/
│   │   └── tesouraria/
│   ├── views/
│   └── ... (main.tsx, setupTests.ts, etc.)
└── tests/
    ├── app/
    ├── features/
    ├── shared/
    ├── test-utils/         # renderWithProviders.tsx (pendente implementação)
    ├── mocks/              # firebase.mock.ts, api.mock.ts
    └── e2e/
```

## Estilos

Features podem ter uma pasta `styles/` para centralizar objetos sx reutilizaveis.

Estrutura canonica:

```txt
styles/
├── colors.ts       → paleta de cores (ex: colors.verdeEscuro, colors.cinzaTexto)
├── surfaces.ts     → superficies (paper, dialog, cartaoResumo)
├── typography.ts   → estilos de texto e chipStatus(status)
├── components.ts   → botoes, chips, tabela, etc.
└── layout.ts       → containers, grids, responsivo
```

Regras:

- Componentes importam de `styles/` e usam spread (`sx={{ ...surfaces.paper, ...typography.titulo }}`).
- Nao coloque logica de estado ou regra de negocio em `styles/`.
- Nao importe `styles/` de hooks, services ou utils.
- Features sem `styles/` podem continuar usando sx inline normalmente.

## Testes

Os testes devem espelhar a estrutura do `src`.

Exemplo:

```txt
src/features/tesouraria/components/pix/mobile/PixTransacaoCard.tsx
tests/features/tesouraria/components/pix/mobile/PixTransacaoCard.test.tsx
```

Use Vitest + React Testing Library.

Prefira:

```txt
getByText
getByRole
getByPlaceholderText
getByLabelText
queryByText
```

Evite depender de classe CSS gerada pelo MUI.

Para moeda formatada, use regex:

```ts
expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();
```

## MUI e visual

Usar o padrão visual atual do sistema:

```txt
Verde escuro: #063D31
Preto/esverdeado: #021B16
Cinza texto: #526760
Fundo suave: #F6F8F7
Verde claro: #EAF3EF
Branco: #FFFFFF
Alerta suave: #FFF7E0
Alerta texto: #6B4E00
Erro suave: #FDF0F0
Erro texto: #7A1F1F
```

Evite azul vibrante, roxo ou cores que não combinem com a identidade atual.

Componentes devem usar:

```txt
Paper elevation={0}
borda leve
borderRadius entre 2 e 4
sombra sutil quando fizer sentido
valores financeiros com fontWeight alto
textos auxiliares em cinza
```

## Mobile

Mobile não é desktop espremido.

Para mobile:

1. evitar tabelas;
2. usar cards;
3. usar ações fáceis de tocar;
4. truncar textos longos;
5. evitar excesso de informação;
6. priorizar leitura rápida;
7. usar filtros horizontais quando fizer sentido.

## MUI e JSDOM

Se precisar mockar `navigator.clipboard`, não use `Object.assign`.

Use:

```ts
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
```

## Documentação técnica

Docs detalhados em `docs/README.md`:

- Arquitetura, fluxos e organização: `docs/arquitetura.md`
- Guia de estilos: `docs/padroes/estilos.md`
- Guia de testes: `docs/padroes/testes.md`
- Documentos de cada feature em `docs/modulos/`

Consulte antes de fazer mudanças estruturais ou de estilo.

## Comentários no código

Comente apenas o que ajuda manutenção. Não comente o óbvio linha a linha.

Situações que merecem comentário:

- **regra de negócio**: explicar o "por que" de uma decisão, não o "o que";
- **decisão de arquitetura**: por que escolheu este padrão e não outro;
- **fallback temporário**: marcar com `// TEMP: <motivo>` e vincular a issue;
- **compatibilidade legada**: porque um campo antigo ainda precisa existir;
- **integração externa**: contrato esperado do provedor (mas sem expor chave);
- **ponto não óbvio**: algoritmo, fórmula ou condição que parece errada mas está certa.

Não comente:
- nomes de variáveis ou funções auto-explicativas;
- chamadas de API padrão ou óbvias;
- blocos de código que repetem a documentação do framework.

## Comandos

Rodar frontend:

```bash
npm run dev -- --host 0.0.0.0
```

Rodar testes:

```bash
npm run test:run
```

Rodar build:

```bash
npm run build
```

## Antes de finalizar tarefa frontend

Sempre sugerir ou rodar:

```bash
npm run build
```

Se alterou testes ou componentes:

```bash
npm run test:run -- caminho/dos/testes
```

## Arquivos de ambiente

Não alterar `.env.local` sem autorização.

Não versionar `.env.local`.

## Views Desktop/Mobile

Features com layouts significativamente diferentes entre desktop e mobile devem
seguir o padrao estabelecido em `premios` e `aderidos`:

- `components/desktop/<Feature>DesktopView.tsx` — layout completo para desktop;
- `components/mobile/<Feature>MobileView.tsx` — layout completo para mobile;
- O componente orquestrador (ex: `PremiosTab.tsx`, `MinhasRifasTab.tsx`) faz o
  switch usando `usePremiosLayout` (importado de hooks compartilhados ou da
  propria feature).

Componentes visuais puros que aparecem em ambas as views ficam em
`components/shared/` (ex: `EmptyState`, `LoadingState`).

## Roteamento e Auth

`PrivateRoute` deve ser um componente compartilhado em `shared/components/`, não
definido inline no arquivo de rotas.

Para rotas com restrição de cargo, use `RequireAuth({ cargoMinimo })` que redireciona
para `/` se o usuário não tiver permissão.

`QueryClientProvider` do TanStack Query deve estar na árvore React em `App.tsx` para
que hooks de cache (useQuery, useMutation) funcionem em toda a aplicação.

## Integrações

O frontend deve consumir o backend do sistema.

## Otimização, Transições e Code Splitting

**Code Splitting (Lazy Loading):**
Todas as rotas de página (`*Page.tsx`) DEVEM ser importadas dinamicamente usando `React.lazy()` no arquivo de rotas. O componente principal de roteamento deve ser envolvido em `<Suspense fallback={<CircularProgress />}>` para garantir o split do bundle.

**Transições Fluidas (Framer Motion):**
O projeto utiliza `framer-motion` para garantir micro-animações dinâmicas e transições visuais de rota de alto nível que causam uma excelente impressão (fator WOW).
Sempre que orquestrar a troca de rotas ou montagem/desmontagem condicional de componentes complexos, utilize `<AnimatePresence>` e `<motion.div>` em vez de montagem abrupta.

**Cache (React Query):**
- Por padrão, o `staleTime` global é definido para otimizar requisições repetidas (ex: 5 minutos).
- Para listagens altamente estáticas (como lista de prêmios), declare explicitamente `{ staleTime: Infinity }`.
- Para dados em tempo real, use a revalidação imediata com `queryClient.invalidateQueries`.

**Vite Build:**
A configuração do `vite.config.ts` utiliza `manualChunks` no `rollupOptions` para separar dependências de terceiros (vendors) como react, firebase, mui e framer. Sempre que adicionar uma biblioteca grande, registre-a no `vendor` correspondente para melhorar o cache de build.
