# Arquitetura Do Frontend

## Objetivo

Explicar a organizacao geral do frontend: como o aplicativo e montado, como
as rotas funcionam e como os dados fluem das APIs para a tela.

## Pilha Tecnologica

```txt
React 18 + TypeScript
  react-router-dom (roteamento)
  TanStack Query (cache de servidor)
  MUI 7 (componentes visuais)
  Firebase Web SDK (auth, storage)
  react-hook-form + Yup (formularios)
  recharts (graficos)
```

## Boot Da Aplicacao

```txt
main.tsx
  -> StrictMode
    -> QueryClientProvider
      -> ThemeProvider (MUI theme com paleta verde)
        -> CssBaseline
          -> <App />

App.tsx
  -> BrowserRouter
    -> AppRoutes (routes.tsx)

routes.tsx
  /              -> LoginPage
  /login         -> LoginPage
  /register      -> RegisterPage
  /dashboard     -> PrivateRoute -> DashboardPage
  *              -> redirect /
```

## Organizacao Por Camadas

```txt
src/
├── main.tsx               # Entry point (providers)
├── app/                   # Configuracao do app
│   ├── App.tsx            # Router root
│   ├── routes.tsx         # Definicao de rotas
│   ├── theme.ts           # Tema MUI (paleta, tipografia, componentes)
│   └── queryClient.ts     # TanStack Query config
├── features/              # Modulos de negocio
│   ├── aderidos/          # Painel do vendedor
│   ├── auth/              # Login/registro
│   ├── premios/           # Premios
│   ├── rifas/             # Servicos de rifas
│   ├── secretaria/        # Administracao de membros
│   └── tesouraria/        # Financeiro
├── shared/                # Codigo compartilhado
│   ├── components/        # DashboardSidebar, NotificacoesSidebar, ModalImagemPix
│   ├── config/            # firebase.ts
│   ├── hooks/             # useNotificacoes, useKeyboardHeight, useCompactacao
│   ├── services/          # api.ts, storageService.ts
│   ├── types/             # models.ts, constants.ts
│   └── utils/             # sanitizadores.ts, notificacoesUtils.ts
└── views/                 # Paginas
    └── pages/
        └── DashboardPage.tsx
```

## Feature-First

Cada feature em `src/features/` e autonoma:

```txt
features/minha-feature/
├── components/         # Componentes de UI
│   └── subpasta/       # Agrupamento por contexto
├── hooks/              # Logica de estado e efeitos
├── services/           # Chamadas de API
├── styles/             # Objetos sx centralizados
├── types/              # Tipos especificos da feature
├── utils/              # Funcoes puras
├── tokens/             # Tokens de design (opcional)
├── mocks/              # Dados mock para dev/tests
├── legacy/             # Codigo antigo nao removivel
└── AGENTS.md           # Guia de decisao da feature
```

Nao existem pastas genericas como `controllers` ou `containers`.

## Fluxo De Dados

```txt
Componente (JSX)
  ䷀ props
  Hook (useFeature)
    ䷀ chamada ao service
    Service (fetchAPI)
      ䷀ HTTP para backend Express
      Backend responde JSON
    Service retorna dados tipados
  Hook atualiza estado (TanStack Query ou useState)
  Componente re-renderiza
```

Hooks nunca chamam APIs diretamente — usam services. Services usam `fetchAPI()`
de `shared/services/api.ts`, que injeta o token Firebase automaticamente.

## Responsividade

- `useTesourariaLayout()` / `useMediaQuery(theme.breakpoints.down("md"))`
- Componentes separados por viewport: `desktop/` e `mobile/` dentro da feature
- Abaixo de `md` (960px): cards substituem tabelas, botoes sao full-width
- Navegacao muda de tabs para drawer em mobile

## Autenticacao

- `onAuthStateChanged` vigia o usuario logado
- `PrivateRoute` redireciona para `/login` se nao autenticado
- `DashboardPage` le o perfil do Firestore e roteia para o contexto certo
  (aderido, tesouraria, secretaria)

## Testes

Testes em `tests/` espelham a estrutura de `src/`. Usam Vitest + RTL + happy-dom.
Veja [padroes/testes.md](padroes/testes.md) para detalhes.

## Routas

| Path | Componente | Auth | Contexto |
| --- | --- | --- | --- |
| `/` | `LoginPage` | — | — |
| `/login` | `LoginPage` | — | — |
| `/register` | `RegisterPage` | — | — |
| `/dashboard` | `DashboardPage` | PrivateRoute | Aderido / Tesouraria / Secretaria |

## Regras E Cuidados

- Nunca importar de `features/x` dentro de `features/y` — use `shared/`.
- `shared/` nunca importa de `features/`.
- `services/` dentro de features chamam `fetchAPI` com caminho relativo ao backend.
- `styles/` dentro de features sao objetos sx — sem logica de estado ou negocio.
- `legacy/` dentro de features nao deve ser base para codigo novo.
- Nao criar dependencia circular entre hooks e componentes.

## Testes Relacionados

- `tests/app/DashboardPage.test.tsx`
- `tests/app/routes.test.tsx`
- `tests/features/*/pages/*.test.tsx` (testes de pagina por feature)
