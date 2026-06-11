# Guia De Testes

## Objetivo

Documentar como os testes sao organizados, escritos e executados no frontend.

## Stack

| Ferramenta | Uso |
| --- | --- |
| Vitest 4 | Runner e assertions |
| Testing Library (RTL) | Renderizacao e queries |
| happy-dom 20 | Ambiente DOM virtual |
| Playwright 1.60 | Testes E2E |
| @vitest/coverage-v8 | Cobertura |

## Comandos

```bash
npm run test:run                  # Todos uma vez
npm run test:watch                # Modo watch
npm run test:ui                   # Interface grafica Vitest
npm run test:coverage             # Relatorio de cobertura
npm run test:aderidos             # So feature aderidos
npm run test:tesouraria           # So feature tesouraria
npm run test:auth                 # So auth
npm run test:secretaria           # So secretaria
npm run test:premios              # So premios
npm run test:rifas                # So rifas
npm run test:shared               # So shared
npm run test:app                  # So app/
```

## Organizacao

Testes em `tests/` espelham a estrutura de `src/`:

```txt
tests/
├── app/                    # Espelha src/app/
│   ├── DashboardPage.test.tsx
│   └── routes.test.tsx
├── shared/                 # Espelha src/shared/
│   ├── components/
│   ├── hooks/
│   └── services/
└── features/              # Espelha src/features/
    ├── aderidos/
    ├── auth/
    ├── premios/
    ├── rifas/
    ├── secretaria/
    └── tesouraria/
```

## O Que Testar Por Camada

| Camada | O Que Testar | Como |
| --- | --- | --- |
| **Utils** | Entrada → saida, bordas | Funcao pura, sem mock |
| **Services** | Chamada HTTP, normalizacao, erro | Mock `fetchAPI` via `vi.mocked` |
| **Hooks** | Estado inicial, acao, loading, erro | `renderHook` + mock service |
| **Componentes** | Renderizacao, interacao, estados vazio/erro | `render` + RTL queries + mock hooks |
| **Paginas** | Fluxo completo do usuario | `render` + mock services |
| **E2E** | Fluxo critico (ex: venda Pix) | Playwright com emuladores |

## Mocks Disponiveis

```txt
tests/mocks/
├── firebase.mock.ts       # Mock auth, db, storage
├── api.mock.ts            # Mock fetchAPI
└── storage.mock.ts        # Mock Firebase Storage
```

O setup em `src/setupTests.ts` ja configura `jest-dom` matchers e mock do
Firebase Storage.

## Boas Praticas

```tsx
// 1. Mock servicos no topo
import { meuService } from "@/features/minha-feature/services/meuService";
vi.mocked(meuService.minhaFuncao).mockResolvedValue(dadosMock);

// 2. Renderizar componente
render(<MeuComponente />);

// 3. Esperar estado assincrono
expect(await screen.findByText("Titulo")).toBeInTheDocument();

// 4. Interagir
await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

// 5. Verificar resultado
expect(meuService.minhaFuncao).toHaveBeenCalledWith(paramEsperado);
```

### Regras

- Use `screen.findBy*` para elementos que aparecem apos async.
- Use `screen.getBy*` para elementos que ja existem no DOM.
- Prefira `userEvent` sobre `fireEvent` para simular interacao realista.
- Mock servicos no `beforeEach`, restaure com `afterEach` se necessario.
- Nao teste implementacao interna (estado, props internas) — teste
  comportamento visivel.
- Para hooks, use `renderHook` de `@testing-library/react`.
- Testes de pagina mockam services (nao hooks individuais).

## Configuracao

`vite.config.ts`:

```ts
test: {
  environment: "happy-dom",
  globals: true,
  setupFiles: ["./src/setupTests.ts"],
  include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  exclude: ["tests/e2e/**"],
}
```

## Testes E2E

Testes em `tests/e2e/` com Playwright. A config esta em `playwright.config.ts`:

- Test dir: `tests/e2e`
- Single worker
- 90s timeout
- Web server: `npm run dev` com emuladores
- Apenas Chromium

Para rodar localmente:

```bash
npx playwright test tests/e2e/tesouraria/
```

## Cobertura

```bash
npm run test:coverage
```

Relatorio em `coverage/`. Use como guia, nao como meta rigida — priorize
testar fluxos criticos e bordas sobre atingir percentual.
