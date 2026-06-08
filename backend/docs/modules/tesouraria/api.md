# API Da Tesouraria

## Objetivo

Documentar os endpoints backend expostos pelo modulo de tesouraria, incluindo
middleware, origem dos dados e formato geral das respostas.

## Arquivos Envolvidos

| Endpoint | Rota | Controller | Service |
| --- | --- | --- | --- |
| `/tesouraria/relatorio` | `relatorioTesourariaRoutes.ts` | `obterRelatorioTesourariaController.ts` | `TesourariaRelatorioService` |
| `/tesouraria/historico` | `relatorioTesourariaRoutes.ts` | `obterHistoricoTesourariaController.ts` | `TesourariaRelatorioService` |
| `/tesouraria/transacoes-bancarias` | `pixTransacoesRoutes.ts` | `listarPixTransacoesController.ts` | `PixTransacoesService` |
| `/tesouraria/transacoes-bancarias/resumo` | `pixTransacoesRoutes.ts` | `obterPixTransacoesResumoController.ts` | `PixTransacoesService` |
| `/tesouraria/transacoes-bancarias/sincronizar` | `pixTransacoesRoutes.ts` | `sincronizarPixTransacoesController.ts` | `PixTransacoesService` |

## Fluxo

```txt
Cliente
  -> Authorization: Bearer <token>
  -> /tesouraria/*
  -> validateToken
  -> requireTesourariaOrAdmin
  -> controller
  -> TesourariaService
  -> Firestore/Admin SDK
```

## Imports E Dependencias

| Import | Uso |
| --- | --- |
| `validateToken` | Exige token Firebase valido. |
| `requireTesourariaOrAdmin` | Exige cargo financeiro/admin para acesso amplo. |
| `tesourariaController` | Fornece handlers HTTP para as rotas. |
| `TesourariaService` | Facade chamada pelos controllers. |

## Funcoes E Metodos

| Metodo e endpoint | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `GET /tesouraria/relatorio` | Retornar resumo financeiro por aderido. | Token autenticado | `{ resumoGeral, aderidos }` | Derivado de `usuarios` e bilhetes `pago`. |
| `GET /tesouraria/historico` | Retornar historico detalhado de compras. | Token autenticado | `{ historico }` | Inclui bilhetes `pago` e `pendente`. |
| `GET /tesouraria/transacoes-bancarias` | Listar transacoes Pix locais. | Token autenticado | `{ transacoes }` | Derivado de bilhetes `pago`, `pendente`, `recusado`. |
| `GET /tesouraria/transacoes-bancarias/resumo` | Retornar totais agregados Pix. | Token autenticado | `{ resumo }` | Usa `calcularResumoPixTransacoes`. |
| `POST /tesouraria/transacoes-bancarias/sincronizar` | Manter endpoint de sincronizacao compativel. | Token autenticado | `{ sucesso, sincronizado, mensagem }` | No-op controlado, sem provedor externo. |

## Contratos De Resposta

### Relatorio

```ts
{
  resumoGeral: {
    totalArrecadado: number;
    rifasPagas: number;
    aderidosAtivos: number;
  };
  aderidos: Array<{
    id: string;
    nome: string;
    cpf: string;
    arrecadado: number;
    meta: number;
    rifasVendidas: number;
  }>;
}
```

### Historico

```ts
{
  historico: Array<{
    numero_rifa: string;
    vendedor_nome: string;
    vendedor_cpf: string;
    comprador_id: string | null;
    comprador_nome: string;
    comprador_telefone: string;
    comprador_email: string;
    data_reserva: string;
    data_pagamento: string;
    comprovante_url: string | null;
    status: string;
    valor: number;
  }>;
}
```

### Transacoes Pix

```ts
{
  transacoes: PixTransacao[];
}
```

`PixTransacao` esta definido em `types/tesourariaTypes.ts` e inclui status de
pagamento, status de conciliacao, valores, comprador, aderido e rifas.

### Resumo Pix

```ts
{
  resumo: {
    totalRecebido: number;
    totalPendente: number;
    totalCancelado: number;
    totalDivergente: number;
    quantidadePagas: number;
    quantidadeAguardando: number;
    quantidadeCanceladas: number;
    quantidadeNaoIdentificadas: number;
    ticketMedio: number;
  };
}
```

### Sincronizacao Pix

```ts
{
  sucesso: true;
  sincronizado: false;
  mensagem: string;
}
```

## Regras E Cuidados

- Todos os endpoints usam `validateToken`.
- Todos os endpoints usam `requireTesourariaOrAdmin`.
- Erros internos retornam mensagens genericas para nao vazar detalhes.
- `/rifas/relatorio` e `/rifas/historico` seguem funcionando como aliases.
- A sincronizacao nao deve chamar provedor externo nesta implementacao.

## Testes Relacionados

- `backend/functions/tests/tesouraria/routes/tesourariaRoutes.spec.ts`
- `backend/functions/tests/tesouraria/controllers/obterRelatorioTesourariaController.spec.ts`
- `backend/functions/tests/tesouraria/controllers/obterHistoricoTesourariaController.spec.ts`
- `backend/functions/tests/tesouraria/controllers/pixTransacoesController.spec.ts`
- `backend/functions/tests/rifas/routes/relatorioRifasRoutes.spec.ts`
