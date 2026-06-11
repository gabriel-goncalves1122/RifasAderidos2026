# Modulo Secretaria (Gestao De Membros)

## Objetivo

Painel administrativo da secretaria: cadastro, edicao, visualizacao e
gerenciamento de membros (aderidos). CRUD completo com filtros, busca e
resumo estatistico.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Pagina | `pages/SecretariaPage.tsx` |
| Componentes | `components/ListaAderidos.tsx`, `components/ModalAdicionarAderido.tsx`, `components/ModalDetalhesAderido.tsx`, `components/ResumoSecretariaCards.tsx` |
| Hooks | `hooks/useSecretaria.ts` |
| Services | `services/secretariaService.ts` |
| Mappers | `mappers/secretariaMapper.ts` |
| Utils | `utils/calcularResumoSecretaria.ts`, `utils/filtrarAderidos.ts`, `utils/formatadoresSecretaria.ts` |

## Fluxo

```txt
DashboardPage (contexto = secretaria)
  -> SecretariaPage
    -> SecretariaHeader (titulo, acao de importar)
    -> ResumoSecretariaCards (cards estatisticos)
    -> ImportacaoCard (importacao CSV)
    -> ListaAderidos (tabela com busca e filtros)
      -> CargoChip / StatusChip / ModalidadeChip
    -> ModalAdicionarAderido (formulario de cadastro)
    -> ModalDetalhesAderido (detalhes + edicao)
      -> FormEditarAderido
      -> ResumoOperacionalAderido
```

## Componentes E Hooks

| Nome | Responsabilidade | Props Relevantes |
| --- | --- | --- |
| `SecretariaPage` | Pagina principal com tabs e orquestracao | — |
| `ListaAderidos` | Tabela de membros com busca e filtros | `aderidos`, `onEditar` |
| `ModalAdicionarAderido` | Modal de cadastro de novo membro | `open`, `onClose`, `onSalvar` |
| `ModalDetalhesAderido` | Modal de detalhes e edicao | `aderido`, `open`, `onClose` |
| `ResumoSecretariaCards` | Cards de resumo (total, ativos, pendentes) | `aderidos` |
| `SecretariaHeader` | Cabecalho com titulo e botoes de acao | `titulo`, `onImportar` |
| `CargoChip` | Chip colorido para cargo do membro | `cargo` |
| `StatusChip` | Chip para status (ativo/inativo) | `status` |
| `ModalidadeChip` | Chip para tipo de adesao | `modalidade` |
| `useSecretaria` | Hook orquestrador: CRUD, busca, importacao | — |

## Imports E Dependencias

| Dependencia | Uso |
| --- | --- |
| `react-hook-form` + `yup` | Formularios de cadastro e edicao |
| `papaparse` | Importacao de dados via CSV |
| `shared/services/api.ts` | `fetchAPI` para CRUD de membros |
| `shared/types/secretaria.ts` | Tipos `AderidoSecretaria`, `FormNovoAderido`, `FormEditarAderido` |

## Regras E Cuidados

- Busca textual filtra por nome, email, CPF e telefone simultaneamente.
- Filtros por cargo, status e modalidade sao combinaveis (AND).
- Mapper (`secretariaMapper.ts`) converte dados da API para o formato do
  formulario e vice-versa.
- Importacao CSV usa `papaparse` e valida formato antes de enviar ao backend.
- Nao permite editar CPF apos criacao (regra de negocio).

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| Pagina | `tests/features/secretaria/pages/SecretariaPage.test.tsx` |
| Componentes | `tests/features/secretaria/components/*.test.tsx` |
| Hook | `tests/features/secretaria/hooks/useSecretaria.test.tsx` |
| Service | `tests/features/secretaria/services/secretariaService.test.ts` |
| Mapper | `tests/features/secretaria/mappers/secretariaMapper.test.ts` |
| Utils | `tests/features/secretaria/utils/*.test.ts` |
