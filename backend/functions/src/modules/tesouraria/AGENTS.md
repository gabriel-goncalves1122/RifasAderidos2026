# AGENTS.md - Modulo Tesouraria

## Escopo

Este modulo e o dominio backend canonico para tesouraria financeira.

Ele cobre:

- Pix derivado dos dados locais de `bilhetes`;
- relatorio financeiro;
- historico/auditoria de compras;
- resumo de transacoes Pix;
- conciliacao futura;
- compatibilidade com endpoints financeiros antigos de `rifas`;
- isolamento do legacy OCR/IA/manual de auditoria.

Nao crie integracao direta com provedor externo sem autorizacao explicita.

## Estrutura

```txt
modules/tesouraria/
├── AGENTS.md
├── tesourariaController.ts
├── tesourariaRoutes.ts
├── tesourariaService.ts
├── controllers/
├── helpers/
├── legacy/
│   └── auditoria/
├── routes/
├── services/
└── types/
```

## Rotas E Compatibilidade

Rotas canonicas:

```txt
GET  /tesouraria/relatorio
GET  /tesouraria/historico
GET  /tesouraria/transacoes-bancarias
GET  /tesouraria/transacoes-bancarias/resumo
POST /tesouraria/transacoes-bancarias/sincronizar
```

Aliases preservados em `rifas`:

```txt
GET /rifas/relatorio
GET /rifas/historico
```

Os aliases antigos devem continuar delegando para `tesouraria` enquanto houver consumidor.

## Pix Local

`PixTransacoesService` deriva transacoes Pix dos bilhetes locais.

Regras atuais:

- nao chama banco/provedor externo;
- agrupa rifas por comprovante, comprador ou compra manual;
- calcula valores com base no valor unitario atual da rifa;
- mapeia `pago`, `pendente` e `recusado` para status Pix estaveis;
- `/sincronizar` e compatibilidade/no-op controlado.

As regras puras de agrupamento, mapeamento, montagem e resumo Pix ficam em `helpers/pixTransacoesHelper.ts`.

O service deve buscar documentos e chamar helpers. Helpers nao devem acessar Firestore/Admin SDK, Express, `Request` ou `Response`.

## Relatorio E Historico

`TesourariaRelatorioService` e a fonte canonica para:

- relatorio financeiro de aderidos;
- historico detalhado de compras pagas e pendentes.

Nao duplique esses calculos em `rifas`. Se precisar manter compatibilidade, use wrappers/delegacao.

## Types

Contratos especificos do modulo ficam em `types/tesourariaTypes.ts`.

Regras:

- status financeiros devem ser valores estaveis;
- valores monetarios permanecem em `number` no contrato atual;
- nao renomear campos consumidos pelo frontend sem migracao coordenada.

## Legacy De Auditoria

`legacy/auditoria` contem o fluxo OCR/IA/manual antigo.

Regras:

- manter `/auditorias/*` funcionando por wrappers em `modules/auditoria`;
- nao importar legacy em codigo novo, salvo compatibilidade explicita;
- nao misturar OCR/IA/manual com os services novos de Pix;
- preservar testes ao mover ou adaptar qualquer caminho.

## Limites Do Dominio

Nao alterar sem autorizacao explicita:

- Firebase rules;
- Firebase Auth;
- CORS global;
- `.env` ou credenciais;
- integracoes externas sensiveis;
- endpoints de producao sem aliases ou plano de migracao.

## Testes

Testes especificos deste dominio ficam em `backend/functions/tests/tesouraria`.

Siga tambem `backend/functions/tests/AGENTS.md`.
