# AGENTS.md - Aderidos

## Escopo

Este guia vale para tudo dentro de `frontend/src/features/aderidos`.

A feature Aderidos cobre o painel de rifas do aderido, seleção de rifas, checkout Pix via backend do sistema, notificações e correção de dados.

### Nota sobre a feature `rifas`

O codigo ativo da antiga `features/rifas` (`buscarMinhasRifas`, `corrigirDadosRifasRecusadas`) foi movido para `services/aderidoRifaService.ts`. O restante da feature `rifas` (fluxo antigo de venda direta com upload, `rifasStorageService`, hook `useRifas`) está em `features/rifas/legacy/`. Nao importe de `features/rifas/` diretamente.

## Arquitetura

- `components`: UI pura. Componentes recebem dados/callbacks por props e não chamam backend.
- `hooks`: orquestração de tela, cache, estados locais, seleção, modais e callbacks.
- `services`: chamadas ao backend do sistema. Nunca chamar provedor financeiro direto pelo frontend. Atualmente: `checkoutPixService.ts` (criar cobranca Pix) e `aderidoRifaService.ts` (buscar rifas, corrigir dados).
- `types`: contratos TypeScript do domínio.
- `utils`: regras puras, agrupamentos, filtros e formatadores.
- `styles`: estilos por área visual. Evite arquivos grandes; divida por resumo, rifas, carrinho ou checkout quando crescer.
- `tokens`: design tokens primitivos (colors, typography, motion) para uso em arquivos de estilo.

Não crie pasta `controllers` nesta feature.

## Cache E Dados

- Use TanStack Query para dados remotos do painel quando houver cache/invalidação.
- Query keys devem incluir feature e usuário, por exemplo:
  - `["aderidos", "minhas-rifas", userId]`;
  - `["aderidos", "notificacoes", userId]`.
- Invalide cache após checkout concluído, correção de dados e leitura de notificações.
- Mantenha seleção, filtros, modal aberto e detalhes como estado local do hook.

## UI E Fluxos

- Aderidos pode espelhar a linguagem visual da Tesouraria, mas não deve importar componentes da feature Tesouraria.
- Use `Paper elevation={0}`, bordas leves, radius entre `2` e `2.25`, fundo suave e a paleta definida em `frontend/AGENTS.md`.
- Status `pendente`/`Em análise` deve usar amarelo suave.
- Correção por negação da tesouraria significa corrigir dados, sem upload obrigatório no fluxo novo.
- Notificações legadas sem tipo devem continuar compatíveis.

## Checkout Pix

- O frontend chama apenas o backend do sistema.
- O contrato preparado de Pix fica em service/type da feature, sem expor credenciais ou nomes de provedor na UI.
- Se o endpoint ainda não estiver disponível, mostrar estado de erro/indisponibilidade controlado.

## Testes

Espelhe `src` em `tests/features/aderidos`.

Cubra:

- hooks com cache, loading, invalidação e erro;
- services com endpoint/payload esperado;
- componentes por comportamento visível;
- utils com entradas e saídas determinísticas;
- checkout e correção sem upload obrigatório.

Comandos recomendados:

```bash
cd frontend
npm run test:run -- tests/features/aderidos
npm run build
```
