# AGENTS.md - Secretaria / Membros

## Escopo

Esta subfeature concentra listagem, cadastro, edição e detalhes de aderidos e
membros da comissão. A navegação principal `Aderidos / Documentos` pertence ao
`DashboardHeader`; não crie tabs equivalentes dentro desta pasta.

## Arquitetura

- `MembrosSecretariaView.tsx` orquestra apenas a tela de membros.
- Componentes visuais recebem dados e callbacks; não chamam API diretamente.
- Hooks coordenam carregamento, seleção, atalhos e feedback.
- `services/secretariaService.ts` usa exclusivamente `fetchAPI`.
- Regras puras ficam em `utils/`; normalização de contrato fica em `mappers/`.
- Não crie barrels em subpastas.

## UX

- Desktop usa tabela + painel de detalhes; mobile usa cards + dialog.
- A navegação interna `Aderidos / Comissão` permanece abaixo do resumo.
- Ações sem endpoint seguro não devem aparecer habilitadas.
- Formulários normalizam nome, e-mail, telefone e CPF antes do envio.

## Testes

Espelhe a estrutura em `tests/features/secretaria/membros` e cubra controller,
ordenação, formulários, views desktop/mobile e estados de erro.
