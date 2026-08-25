# AGENTS.md - Tesouraria Pix

## Escopo

Este guia vale para tudo dentro de `frontend/src/features/tesouraria`.

A area oficial de transacoes financeiras da tesouraria e Pix. Use `Pix` em arquivos, simbolos, componentes, hooks, services, utils, mocks e textos de UI dessa area. Nao use nomes de provedores externos em novos arquivos, simbolos ou copy da feature.

Nao altere backend, autenticacao, regras do Firebase, `.env.local` ou integracoes sensiveis sem autorizacao explicita.

## Arvore canonica

```txt
frontend/src/features/tesouraria/
├── AGENTS.md
├── components/
│   ├── auditoriaCompras/
│   │   ├── desktop/
│   │   ├── mobile/
│   │   └── shared/
│   ├── desempenho/
│   │   ├── desktop/
│   │   ├── mobile/
│   │   └── shared/
│   ├── layout/
│   ├── pix/
│   │   ├── layout/
│   │   ├── tabs/
│   │   └── transacoes/
│   │       ├── desktop/
│   │       ├── mobile/
│   │       └── shared/
│   └── shared/
├── hooks/
├── legacy/
│   ├── compat/
│   └── ia/
├── mocks/
├── pages/
├── services/
├── styles/
├── types/
└── utils/
```

## Papel das pastas

- `pages`: composicao final das telas e ligacao entre layout, tabs e controllers.
- `components`: somente UI. Componentes nao chamam backend, nao conhecem endpoints e nao concentram regra de negocio.
- `components/layout`: shell geral da tesouraria, responsividade e containers comuns.
- `components/shared`: componentes reutilizaveis entre dominios da tesouraria.
- `components/pix/layout`: cabecalho, navegacao e estrutura visual da area Pix.
- `components/pix/tabs`: conteudo das abas Pix.
- `components/pix/transacoes`: tabela, cards, filtros, resumo e estados visuais das transacoes Pix.
- `components/auditoriaCompras`: UI do historico/auditoria de compras.
- `components/desempenho`: UI de desempenho. `shared` deve conter apenas componentes visuais.
- `hooks`: controllers de tela e hooks de estado. Controllers orquestram service, filtros, loading e callbacks.
- `services`: chamadas ao backend do sistema. Services normalizam payloads, mas nao implementam UI.
- `types`: contratos TypeScript compartilhados do dominio.
- `utils`: regras puras, agrupamentos, filtros, formatadores e exportacoes sem efeito colateral. `formatadores.ts` centraliza `somenteNumeros`, `formatarMoeda`, `formatarData`, `formatarTelefone`. `constants.ts` centraliza `META_RIFAS_ADERIDO`.
- `styles`: objetos sx compartilhados (cores, tipografia, superficies, componentes). Componentes importam de `styles/` em vez de repetir hex colors e valores inline. Ver seção **Estilos** abaixo.
- `mocks`: dados locais de desenvolvimento/teste, sem credenciais e sem contrato sensivel real.
- `legacy`: codigo isolado para compatibilidade ou fluxos antigos. Codigo novo nao deve importar de `legacy`.
- Mocks nunca devem alimentar tela real automaticamente. Use-os apenas em testes ou em fixture/dev explícito.

## Dominios

### Pix

Use `Pix*`, `usePix*`, `pix*Service`, `pix*Utils`, `pix*Types` e nomes equivalentes para tudo ligado a transacoes financeiras, conciliacao, aderidos financeiros e abas da area Pix.

Regras:

- manter transacoes em `components/pix/transacoes`;
- manter abas em `components/pix/tabs`;
- manter header e navegacao em `components/pix/layout`;
- `usePixController` controla a pagina Pix;
- `usePixTransacoes` controla carregamento, filtros e sincronizacao de transacoes;
- `pixTransacoesService` e o unico ponto da feature para consultar dados Pix no backend;
- `usePixTransacoes` deve exibir lista vazia real quando a API retornar vazio, sem fallback automatico para mocks;
- nao chamar APIs externas sensiveis diretamente do frontend.

### Auditoria De Compras

Use `AuditoriaCompras*` para colecoes/telas e `AuditoriaCompra*` para item individual.
**Nota de Descontinuação:** A aba e o fluxo manual de Reconciliação (`PixReconciliacaoTab`) foram abolidos permanentemente. A auditoria e reconciliação baseiam-se puramente na conciliação automatizada dos Webhooks e no uso da aba de Auditoria de Compras. Não recriar a aba de reconciliação.

Regras:

- componentes desktop ficam em `components/auditoriaCompras/desktop`;
- componentes mobile ficam em `components/auditoriaCompras/mobile`;
- dialogs, resumo, filtros agregadores, status e acoes ficam em `shared`;
- contratos ficam em `types/auditoriaCompras.ts` e DEVEM seguir o padrão `camelCase` por serem DTOs recebidos da API (ex: `TransacaoTesouraria`);
- regras puras ficam em `utils/auditoriaComprasUtils.ts`. **ATENÇÃO:** É estritamente proibido agrupar grandes arrays de dados brutos do banco no Frontend (ex: unir milhares de bilhetes soltos em compras). O frontend deve receber os dados pré-agrupados do backend e apenas focar em filtros (busca, status) ou cálculos de resumo visual.
- acesso ao backend fica em `services/auditoriaComprasService.ts`;
- `useAuditoriaComprasController` controla loading, filtros, resumo, detalhes, edicao e exportacao.

### Desempenho

Use `Desempenho*` para componentes e contratos do dominio.

Regras:

- componentes de desktop e mobile ficam separados;
- componentes de chart/card/empty state ficam em `components/desempenho/shared`;
- contratos ficam em `types/desempenho.ts`;
- formatadores e montagem de dados ficam em `utils/desempenho*`;
- `useDesempenhoController` orquestra a tela.

### Tesouraria

Use `Tesouraria*` apenas para shell, layout geral, pagina agregadora ou elementos compartilhados que nao pertencem exclusivamente a Pix, auditoria de compras ou desempenho.

## Estilos

A pasta `styles/` centraliza objetos sx reutilizaveis para evitar repeticao de cores, bordas, tipografia e espacamento nos componentes.

Arquivos:

- `colors.ts` — paleta de cores (`verdeEscuro`, `pretoEsverdeado`, `cinzaTexto`, `fundoSuave`, `verdeClaro`, ...). Use `colors.xxx` em vez de hex literais.
- `surfaces.ts` — superficies compartilhadas (`paper`, `paperComSombra`, `dialog`, `cartaoResumo(destaque)`, `cartaoInfo`, ...).
- `typography.ts` — estilos de texto (`titulo`, `label`, `bodyDestaque`, `bodyPequeno`, `valorMonetario`, ...). `chipStatus(status)` retorna sx condicional por status.
- `components.ts` — botoes, chips, tabela (`botaoPrimario`, `botaoSecundario`, `botaoAceitar`, `botaoNegar`, `chipVerde`, `tabelaCabecalho`, `linhaTabela`, ...).
- `layout.ts` — containers e grids (`loadingContainer`, `gridDois`, `cardsGrid`, `drawerPaper`, ...).

Regras:

- Prefira `import { colors } from "../../styles/colors"` e use `sx={{ ...surfaces.paper, ...typography.titulo }}` em vez de inline values.
- Nao coloque logica de estilo condicional complexa em `styles/`; prefira funcoes simples como `cartaoResumo(destaque)`.
- Nao importe `styles/` de `hooks/`, `services/` ou `utils/` — e apenas para camada visual.

## Padroes de arquitetura

- Componentes recebem dados e callbacks por props.
- Hooks podem usar state, effects, services e utils.
- **Estado Local para Filtros:** Filtros de UI (buscas, paginação local, abas internas de tabelas) devem privilegiar o uso de estado local do React (`useState` / `useReducer` dentro do controller) em vez de estado global ou URL (SearchParams), a menos que haja necessidade explícita de *deep linking*.
- Services usam o cliente de API do sistema e retornam dados normalizados (sempre em `camelCase`).
- Utils nao acessam React, DOM, rede, Firebase ou estado global. O processamento de dados (ex: map/reduce) em Utils deve ser evitado se a carga for extensa ou de responsabilidade do servidor.
- Types nao importam componentes.
- Nao crie barrels em subpastas — o unico barrel permitido e o `index.ts` raiz da feature, se necessario.
- Filtros e estados compartilhados devem ter nomes claros, por exemplo `PixTransacoesFiltros`.
- Quando houver conflito entre tipo e componente visual, use alias de tipo no import em vez de renomear UI publica sem necessidade.

## Mobile e desktop

- Desktop pode usar tabelas e densidade maior.
- Mobile deve priorizar cards, acoes tocaveis, filtros compactos e leitura rapida.
- Nao duplique regra de negocio entre desktop e mobile; extraia regra pura para `utils` ou estado para `hooks`.
- Componentes `shared` podem decidir entre mobile/desktop quando forem agregadores visuais simples.

## Legado

- `legacy/compat` guarda wrappers ou componentes antigos mantidos por compatibilidade.
- `legacy/ia` guarda fluxo antigo de auditoria por IA/manual.
- Nao importe `legacy` em codigo novo.
- Nao apague legado sem substituir consumidores e testes equivalentes.
- Se um legado precisar ser reativado, primeiro mova a regra real para `hooks`, `services`, `types` e `utils` canonicos.

## Testes

Os testes devem espelhar os caminhos do `src`.

Exemplo:

```txt
src/features/tesouraria/components/pix/transacoes/mobile/PixTransacaoCard.tsx
tests/features/tesouraria/components/pix/transacoes/mobile/PixTransacaoCard.test.tsx
```

Padroes:

- services testam normalizacao de payload e chamada ao backend;
- hooks testam loading, filtros, callbacks, fallback mobile e fluxos de erro;
- componentes testam comportamento visivel e interacao do usuario;
- utils testam regra pura com entradas e saidas deterministicas;
- prefira queries por papel, label, placeholder e texto visivel;
- evite depender de classes geradas pelo MUI.

Comandos recomendados:

```bash
cd frontend
npm run test:tesouraria
npm run build
```

## Proibicoes locais

Nao fazer sem autorizacao explicita:

- alterar backend;
- alterar autenticacao;
- alterar regras do Firebase;
- alterar `.env.local`;
- versionar credenciais;
- criar chamada direta do frontend para APIs externas sensiveis;
- usar nomes de provedores externos como padrao de produto na feature;
- remover testes sem cobertura equivalente;
- misturar regras de dominios diferentes por conveniencia.

## Antes de finalizar

Verifique:

```bash
rg "nome-do-provedor-externo" frontend/src/features/tesouraria frontend/tests/features/tesouraria
cd frontend && npm run test:tesouraria
cd frontend && npm run build
```
