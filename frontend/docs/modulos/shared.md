# Modulo Shared (Infraestrutura Compartilhada)

## Objetivo

Codigo compartilhado entre todas as features: cliente HTTP, configuracao
Firebase, tipos de dominio, hooks reutilizaveis, componentes de UI comuns e
utilitarios.

## Arquivos Envolvidos

| Area | Arquivos | Responsabilidade |
| --- | --- | --- |
| Config | `config/firebase.ts` | Inicializacao do Firebase Web SDK (auth, db, storage) |
| Services | `services/api.ts` | `fetchAPI`: cliente HTTP com injecao de token e error handling |
| Services | `services/storageService.ts` | Upload de comprovantes para Firebase Storage |
| Hooks | `hooks/useNotificacoes.ts` | Busca e marcacao de notificacoes |
| Hooks | `hooks/useKeyboardHeight.ts` | Deteccao de teclado virtual em mobile |
| Hooks | `hooks/useCompactacao.ts` | Solicitacao de compactacao ZIP ao backend |
| Components | `components/DashboardSidebar.tsx` | Drawer de navegacao principal |
| Components | `components/NotificacoesSidebar.tsx` | Drawer de notificacoes com icones tipados |
| Components | `components/ModalImagemPix.tsx` | Dialog em tela cheia para comprovantes Pix |
| Types | `types/models.ts` | Tipos de dominio: Usuario, Comprador, Bilhete, Premio, Notificacao |
| Types | `types/secretaria.ts` | Tipos especificos da secretaria |
| Types | `types/constants.ts` | Arrays constantes (CURSOS_UNIFEI, CARGOS_COMISSAO) |
| Types | `types/notificacoes.ts` | Tipos de notificacao |
| Utils | `utils/sanitizadores.ts` | `sanitizarNome`, `sanitizarTelefone`, `sanitizarEmail` |
| Utils | `utils/notificacoesUtils.ts` | Normalizacao de tipo de notificacao |

## Cliente HTTP (`fetchAPI`)

`src/shared/services/api.ts` exporta `fetchAPI`, o unico cliente HTTP do
frontend.

### Comportamento

```ts
fetchAPI("/rifas/minhas-rifas");
// -> GET https://.../rifas/minhas-rifas
//    Header: Authorization: Bearer <token-firebase>
//    Header: Content-Type: application/json

fetchAPI("/tesouraria/pix-transacoes", {
  method: "POST",
  body: { acao: "sincronizar" },
});
```

### Fluxo

1. Obtem token Firebase do usuario logado (`auth.currentUser.getIdToken()`).
2. Se nao ha token, lanca erro de autenticacao.
3. Chama `fetch` com headers padrao + token.
4. Se resposta `401`, lanca `ErroAutenticacao`.
5. Se resposta nao `ok`, tenta parsear erro do body.
6. Retorna JSON tipado.

### Console Seguro

Em ambiente de desenvolvimento, logs de aviso/erro usam `import.meta.env.DEV`
para so aparecerem em dev:

```ts
if (import.meta.env.DEV) console.warn("Aviso:", erro);
```

## Firebase Config

`src/shared/config/firebase.ts`:

- Inicializa Firebase App com variaveis de ambiente (`VITE_FIREBASE_*`).
- Conecta em emuladores se `VITE_USE_EMULATORS=true`.
- Exporta `auth`, `db` (Firestore), `storage`.

## Componentes Compartilhados

| Componente | Funcao |
| --- | --- |
| `DashboardSidebar` | Navegacao principal com contexto (aderido/tesouraria/secretaria) e logout |
| `NotificacoesSidebar` | Painel de notificacoes com icones por tipo |
| `ModalImagemPix` | Visualizacao de comprovante Pix em tela cheia |

## Hooks Compartilhados

| Hook | Funcao |
| --- | --- |
| `useNotificacoes` | Buscar e marcar notificacoes como lidas via API |
| `useKeyboardHeight` | Detectar altura do teclado virtual em mobile |
| `useCompactacao` | Solicitar ZIP de dados ao backend |

## Regras E Cuidados

- `shared/` nunca importa de `features/`. Essa e uma regra rigida para
  evitar dependencia circular.
- `fetchAPI` e o unico cliente HTTP. Nao usar `axios` ou `fetch` direto.
- Token Firebase e obtido a cada chamada (nao cacheado) para garantir
  token valido.
- Sanitizadores em `utils/sanitizadores.ts` sao compartilhados entre features
  (aderidos e tesouraria usam os mesmos limites: nome 120, email 254,
  telefone 20 chars).
- Mocks do Firebase (`tests/mocks/firebase.mock.ts`) sao carregados via
  `setupFiles` em `vite.config.ts`.

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| API client | `tests/shared/services/api.test.ts` |
| Componentes | `tests/shared/components/*.test.tsx` |
| Hooks | `tests/shared/hooks/useNotificacoes.test.tsx` |
