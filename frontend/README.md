# Sistema De Rifas — Frontend

Portal do Aderido da Comissao 26. Plataforma para gerenciamento de rifas,
pagamentos Pix, auditoria de compras, premios e administracao de membros.

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 18 + TypeScript | UI e tipagem |
| Vite 5 | Build e dev server |
| MUI 7 (Material UI) | Componentes e temas |
| TanStack Query 5 | Cache e estado servidor |
| Firebase Web SDK 12 | Auth, Storage e Firestore |
| react-hook-form + Yup | Formularios |
| recharts | Graficos |
| Vitest + Testing Library | Testes unitarios |
| Playwright | Testes E2E |
| happy-dom | Ambiente DOM dos testes |

## Requisitos

- Node.js 20+
- npm 10+
- (opcional) Firebase CLI para emuladores

## Comandos

```bash
npm run dev             # Dev server em http://localhost:5173
npm run build           # Build de producao
npm run test:run        # Todos os testes
npm run test:watch      # Testes em modo watch
npm run lint            # ESLint
```

Testes por feature:

```bash
npm run test:aderidos
npm run test:tesouraria
npm run test:auth
npm run test:secretaria
npm run test:premios
npm run test:rifas
npm run test:shared
npm run test:app
```

## Estrutura

```txt
src/
├── main.tsx               # Entry point
├── app/                   # App root, rotas, tema, query client
│   ├── App.tsx
│   ├── routes.tsx
│   ├── theme.ts
│   └── queryClient.ts
├── assets/                # CSS global, imagens estaticas
├── shared/                # Codigo compartilhado entre features
│   ├── components/        # Sidebar, modais, etc.
│   ├── config/            # Firebase init
│   ├── hooks/             # Notificacoes, teclado, compactacao
│   ├── services/          # HTTP client (fetchAPI), Storage
│   ├── types/             # Modelos de dominio
│   └── utils/             # Sanitizadores, formatadores
├── features/              # Modulos de negocio (feature-first)
│   ├── aderidos/          # Painel do vendedor estudante
│   ├── auth/              # Login/registro
│   ├── premios/           # CRUD de premios
│   ├── rifas/             # Servicos de rifas (hooks, API)
│   ├── secretaria/        # Gestao de membros
│   └── tesouraria/        # Financeiro, Pix, auditoria
└── views/                 # Paginas (DashboardPage)
tests/                     # Testes (espelham src/)
```

## Documentacao

Docs detalhados em [docs/](docs/README.md):

- [Arquitetura](docs/arquitetura.md)
- [Estilos](docs/padroes/estilos.md)
- [Testes](docs/padroes/testes.md)
- [Modulo Aderidos](docs/modulos/aderidos.md)
- [Modulo Tesouraria](docs/modulos/tesouraria.md)
- [Modulo Auth](docs/modulos/auth.md)
- [Modulo Secretaria](docs/modulos/secretaria.md)
- [Modulo Premios](docs/modulos/premios.md)
- [Modulo Shared](docs/modulos/shared.md)

## Variaveis de Ambiente

Copie o `.env.example` ou use o `.env` existente:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_EMULATORS=true
```

Com `VITE_USE_EMULATORS=true`, o Firebase SDK conecta nos emuladores locais.
