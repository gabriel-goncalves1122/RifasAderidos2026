# Services Da Tesouraria

## Objetivo

Documentar os services que concentram as regras de negocio da tesouraria:
relatorio financeiro, historico detalhado, transacoes Pix locais, resumo Pix e
sincronizacao compativel.

## Arquivos Envolvidos

| Arquivo | Papel |
| --- | --- |
| `tesourariaService.ts` | Facade usada pelos controllers. |
| `services/tesourariaRelatorioService.ts` | Relatorio financeiro e historico. |
| `services/pixTransacoesService.ts` | Transacoes Pix, resumo e sync no-op. |
| `helpers/pixTransacoesHelper.ts` | Regras puras de Pix. |
| `types/tesourariaTypes.ts` | Tipos retornados pelos services Pix. |

## Fluxo

```txt
Controller
  -> TesourariaService
    -> TesourariaRelatorioService
      -> Firestore: usuarios, bilhetes
    -> PixTransacoesService
      -> Firestore: bilhetes
      -> pixTransacoesHelper
```

## Imports E Dependencias

| Import | Arquivo | Motivo |
| --- | --- | --- |
| `firebase-admin` | Services concretos | Acesso ao Firestore via Admin SDK. |
| `Bilhete` | Relatorio e Pix | Tipar dados da colecao `bilhetes`. |
| `Usuario` | Relatorio | Tipar dados da colecao `usuarios`. |
| `StatusBilhete` | Types | Reusar status base dos bilhetes nas rifas retornadas. |
| `PixTransacao` | Pix | Contrato de cada transacao exibida pela tesouraria. |
| `PixTransacoesResumo` | Pix | Contrato dos totais agregados. |
| `ResultadoSincronizacaoPix` | Pix | Contrato do endpoint de sincronizacao no-op. |
| `StatusConciliacaoPix` | Pix | Status de conciliacao calculado localmente. |
| `StatusPagamentoPix` | Pix | Status de pagamento normalizado para o frontend. |
| `BilheteComNumero` | Pix helper/service | Bilhete com `numero` garantido a partir do `doc.id`. |

## Funcoes E Metodos

### TesourariaService

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `obterRelatorioTesouraria()` | Delegar relatorio financeiro. | Nenhuma | Relatorio financeiro | Chama `TesourariaRelatorioService`. |
| `obterHistoricoDetalhado()` | Delegar historico financeiro. | Nenhuma | Lista de historico | Chama `TesourariaRelatorioService`. |
| `buscarPixTransacoes()` | Delegar listagem Pix. | Nenhuma | `PixTransacao[]` | Chama `PixTransacoesService.buscarTransacoes`. |
| `obterPixTransacoesResumo()` | Delegar resumo Pix. | Nenhuma | `PixTransacoesResumo` | Chama `PixTransacoesService.obterResumo`. |
| `sincronizarPixTransacoes()` | Delegar sync compativel. | Nenhuma | `ResultadoSincronizacaoPix` | No-op controlado. |

### TesourariaRelatorioService

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `obterRelatorioTesouraria()` | Calcular arrecadacao por aderido. | Firestore `usuarios`, `bilhetes` pagos | `{ resumoGeral, aderidos }` | Considera aderidos por `role`, `cargo` ou ausencia de ambos. |
| `obterHistoricoDetalhado()` | Listar compras pagas e pendentes. | Firestore `bilhetes` | Lista ordenada por `data_reserva` desc | Mantem campos usados pelo frontend de auditoria de compras. |

### PixTransacoesService

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `buscarTransacoes()` | Buscar bilhetes financeiros e normalizar em Pix. | Firestore `bilhetes` com status `pago`, `pendente`, `recusado` | `PixTransacao[]` | Agrupa por comprovante, comprador ou chave manual. |
| `obterResumo()` | Calcular totais agregados Pix. | Nenhuma | `PixTransacoesResumo` | Reusa `buscarTransacoes()`. |
| `sincronizar()` | Responder compatibilidade de sync. | Nenhuma | `ResultadoSincronizacaoPix` | Nao chama integracao externa. |

### pixTransacoesHelper

| Nome | Responsabilidade | Entrada | Saida | Observacoes |
| --- | --- | --- | --- | --- |
| `calcularResumoPixTransacoes()` | Calcular totais de uma lista. | `PixTransacao[]` | `PixTransacoesResumo` | Funcao exportada e testada diretamente. |

| `valorDataSeguro()` | Converter datas invalidas em `0`. | String de data | Timestamp | Evita sort quebrado com datas ausentes. |
| `primeiraDataValida()` | Escolher primeira data parseavel. | Lista de datas | ISO string | Fallback atual e `new Date(0).toISOString()`. |
| `normalizarId()` | Criar ID seguro para transacao. | String livre | String normalizada | Remove caracteres fora de `[a-zA-Z0-9_-]`. |
| `chaveCompra()` | Definir chave de agrupamento. | `BilheteComNumero` | String | Prioridade: comprovante, comprador, fallback manual. |
| `statusPagamento()` | Mapear status de bilhete para Pix. | Status local | `StatusPagamentoPix` | `pago -> PAID`, `recusado -> DECLINED`, `pendente -> WAITING`. |
| `statusConciliacao()` | Calcular conciliacao local. | Bilhetes agrupados | `StatusConciliacaoPix` | Pago sem vendedor vira `nao_identificada`. |
| `montarPixTransacao()` | Montar contrato final Pix. | Grupo de bilhetes | `PixTransacao` | Calcula valor, comprador, aderido, rifas e observacao. |

## Regras E Cuidados

- `VALOR_RIFA` atual e `10`; alterar isso muda relatorio, historico e Pix.
- `buscarTransacoes()` nao consulta provedor externo.
- O agrupamento prioriza `comprovante_url`; isso une rifas pagas no mesmo comprovante.
- Transacao recusada usa `motivo_recusa` como observacao quando existir.
- `valorPago` so e preenchido quando `statusPagamento` e `PAID`.
- Mantenha `calcularResumoPixTransacoes()` pura para facilitar testes.
- Helpers de Pix nao devem acessar Firestore/Admin SDK.

## Testes Relacionados

- `backend/functions/tests/tesouraria/services/pixTransacoesService.spec.ts`
- `backend/functions/tests/tesouraria/helpers/pixTransacoesHelper.spec.ts`
- `backend/functions/tests/tesouraria/controllers/pixTransacoesController.spec.ts`
- `backend/functions/tests/rifas/services/rifasService.spec.ts`
