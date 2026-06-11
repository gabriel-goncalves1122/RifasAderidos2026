# Checkout Pix De Rifas

## Objetivo

Documentar o fluxo real de Pix do painel de aderidos: checkout no backend,
webhook assinado, polling e validacao final pela tesouraria.

## Arquivos Envolvidos

| Area | Arquivo |
| --- | --- |
| Rotas | `backend/functions/src/modules/rifas/routes/checkoutPixRoutes.ts` |
| Controllers | `backend/functions/src/modules/rifas/controllers/*CheckoutPix*` |
| Checkout | `backend/functions/src/modules/rifas/services/checkoutPixService.ts` |
| Webhook | `backend/functions/src/modules/rifas/services/checkoutPixWebhookService.ts` |
| Correcao | `backend/functions/src/modules/rifas/services/correcaoDadosRifasService.ts` |
| Provider | `backend/functions/src/shared/services/pagBankPixClient.ts` |
| Tesouraria | `backend/functions/src/modules/tesouraria/services/pixValidacaoService.ts` |

## Variaveis Esperadas

Nao versionar valores reais.

```txt
PAGBANK_API_TOKEN
PAGBANK_API_BASE_URL
PAGBANK_WEBHOOK_TOKEN
API_PUBLIC_BASE_URL
```

`PAGBANK_API_BASE_URL` usa sandbox como fallback. `API_PUBLIC_BASE_URL`
deve apontar para a base publica das Functions para montar `notification_urls`.

## Fluxo

1. Aderido chama `POST /rifas/checkout/pix`.
2. Backend valida rifas disponiveis e cria pedido Pix no PagBank via `POST /orders`.
3. Backend salva `pagamentos_pix` e marca rifas como `reservado`.
4. Webhook `POST /rifas/checkout/pix/webhook` recebe evento assinado.
5. Banco `PAID` ou `AUTHORIZED` muda rifas para `pendente`.
6. Tesouraria usa `aceitar` ou `negar`.
7. Aceite marca rifas como `pago`; negativa marca `recusado` e notifica correcao.

## Exemplos Thunder Client

Base local comum:

```txt
http://127.0.0.1:5001/rifasaderidos2026/us-central1/api
```

Criar checkout:

```http
POST /rifas/checkout/pix
Authorization: Bearer <firebase-token>

{
  "nome": "Maria Silva",
  "telefone": "35999990000",
  "email": "maria@example.com",
  "documento": "12345678909",
  "numerosRifas": ["001", "002"]
}
```

Consultar checkout:

```http
GET /rifas/checkout/pix/ORDE_001
Authorization: Bearer <firebase-token>
```

Aceitar transacao:

```http
POST /tesouraria/transacoes-bancarias/ORDE_001/aceitar
Authorization: Bearer <tesouraria-token>
```

Negar transacao:

```http
POST /tesouraria/transacoes-bancarias/ORDE_001/negar
Authorization: Bearer <tesouraria-token>

{
  "motivo": "Telefone do comprador incorreto."
}
```

Sincronizar abertas:

```http
POST /tesouraria/transacoes-bancarias/sincronizar
Authorization: Bearer <tesouraria-token>
```

## Webhook Simulado

Use o script:

```bash
cd backend/functions
PAGBANK_WEBHOOK_TOKEN=dev-token \
node scripts/simular-webhook-pix.js \
  --url http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/checkout/pix/webhook \
  --order ORDE_001 \
  --status PAID
```

O script monta o raw body e envia `x-authenticity-token` com SHA-256 de
`{PAGBANK_WEBHOOK_TOKEN}-{rawBody}`.

## Testes Relacionados

```txt
tests/rifas/helpers/checkoutPixHelper.spec.ts
tests/rifas/controllers/checkoutPixController.spec.ts
tests/rifas/services/checkoutPixService.spec.ts
tests/rifas/services/checkoutPixWebhookService.spec.ts
tests/rifas/services/correcaoDadosRifasService.spec.ts
tests/tesouraria/services/pixValidacaoService.spec.ts
```
