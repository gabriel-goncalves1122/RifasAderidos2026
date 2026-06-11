# Modulo Premios

## Objetivo

Gerenciamento de premios da rifa: visualizar, cadastrar, editar e excluir
premios, com upload de imagem e galeria.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Componentes | `PremiosTab.tsx`, `PremioCard.tsx`, `HeroBanner.tsx`, `ResumoHeader.tsx` |
| Hook | `hooks/usePremios.ts` |
| Services | (usa `shared/services/api.ts` e `shared/services/storageService.ts`) |

## Fluxo

```txt
MinhasRifasTab (aba Premios)
  -> HeroBanner (banner do evento)
  -> ResumoHeader (cabecalho com estatisticas)
  -> PremiosTab
    -> PremioCard (card de cada premio)
      -> Editar / Excluir (via modal inline)
      -> Upload de imagem (Firebase Storage)
```

## Componentes E Hooks

| Nome | Responsabilidade | Props Relevantes |
| --- | --- | --- |
| `PremiosTab` | Orquestrador de premios (lista, CRUD) | — |
| `PremioCard` | Card individual com imagem, descricao, acoes | `premio`, `onEditar`, `onExcluir` |
| `HeroBanner` | Banner com informacoes do sorteio | — |
| `ResumoHeader` | Cabecalho com estatisticas de premios | — |
| `usePremios` | Hook CRUD: listar, criar, atualizar, excluir, upload imagem | — |

## Imports E Dependencias

| Dependencia | Uso |
| --- | --- |
| `shared/services/api.ts` | `fetchAPI` para CRUD de premios |
| `shared/services/storageService.ts` | Upload de imagem para Firebase Storage |

## Regras E Cuidados

- Upload de imagem vai para Firebase Storage diretamente (nao passa pelo
  backend).
- Metadados da imagem (nome, url) sao salvos no Firestore via backend API.
- Ao excluir premio, a imagem no Storage tambem e removida.
- A ordenacao dos premios e definida pelo backend (por posicao/criacao).

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| Componentes | `tests/features/premios/components/*.test.tsx` |
| Hook | `tests/features/premios/hooks/usePremios.test.tsx` |
