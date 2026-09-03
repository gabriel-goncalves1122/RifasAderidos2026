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
| Provider | `backend/functions/src/shared/services/mercadoPagoPixClient.ts` |
| Tesouraria | `backend/functions/src/modules/tesouraria/services/pixValidacaoService.ts` |

## Variaveis Esperadas

Nao versionar valores reais.

```txt
MERCADOPAGO_API_TOKEN
MERCADOPAGO_API_BASE_URL
MERCADOPAGO_WEBHOOK_TOKEN
API_PUBLIC_BASE_URL
SUPER_ADMIN_EMAILS
SMTP_USER
SMTP_PASS
```

`MERCADOPAGO_API_BASE_URL` usa sandbox como fallback. `API_PUBLIC_BASE_URL`
deve apontar para a base publica das Functions para montar `notification_urls`.

`SUPER_ADMIN_EMAILS` e uma lista separada por virgula de emails com acesso irrestrito.
Fallback: consulta ao documento `configuracoes/sistema` no Firestore.

## Fluxo

1. Aderido chama `POST /rifas/checkout/pix`.
2. Backend valida rifas disponiveis e cria pedido Pix no Mercado Pago via `POST /orders`.
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

## Webhook

O webhook `POST /rifas/checkout/pix/webhook` e aberto (sem `validateToken`) e
valida autenticidade via assinatura HMAC-SHA256.

### Header de Assinatura

- Header: `x-mercadopago-signature` (padrao Mercado Pago).
- Fallback legado: `x-authenticity-token`.
- Algoritmo: HMAC-SHA256, chave = `MERCADOPAGO_WEBHOOK_TOKEN`, mensagem = raw body.
- Output: base64.
- Comparacao: `crypto.timingSafeEqual` para evitar timing attack.

### Fluxo de Processamento

1. Recebe raw body (buffered pelo JSON parser configurado com `verify`).
2. Extrai `id` do pedido e `status` do evento.
3. Valida assinatura conforme algoritmo acima.
4. Executa `runTransaction`:
   - Le `pagamentos_pix` do pedido.
   - Atualiza status do pagamento.
   - Para cada rifa: atualiza status.
   - Cria notificacao (`rifa_liberada` se negado/recusado).
5. Responde 200.

Sincronizar abertas:

```http
POST /tesouraria/transacoes-bancarias/sincronizar
Authorization: Bearer <tesouraria-token>
```

## Polling

Apos criar o checkout, o frontend inicia polling automaticamente:

- Intervalo: 10 segundos.
- Maximo de tentativas: 36 (~6 minutos).
- Rota: `GET /rifas/checkout/pix/:id`.
- Service: `checkoutPixService.consultarCobrancaPix`.
- Estados exibidos no frontend:
  - **Aguardando pagamento** — banner amarelo com spinner e instrucoes.
  - **Confirmado** — banner verde com icone de check.
  - **Expirado** — banner de alerta vermelho/laranja.

A consulta retorna o status atual do banco (`WAITING`, `PAID`, `DECLINED`, etc.).
Se o banco confirmar (`PAID`/`AUTHORIZED`), `onSuccess()` e chamado para limpar
selecao e invalidar cache.

## Webhook Simulado

Use o script:

```bash
cd backend/functions
MERCADOPAGO_WEBHOOK_TOKEN=dev-token \
node scripts/simular-webhook-pix.js \
  --url http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/checkout/pix/webhook \
  --order ORDE_001 \
  --status PAID
```

O script monta o raw body e envia `x-mercadopago-signature` com HMAC-SHA256 de
`{MERCADOPAGO_WEBHOOK_TOKEN}` + raw body em base64. Para compatibilidade legada,
o backend aceita `x-authenticity-token` como fallback.

## Testes Relacionados

```txt
tests/rifas/helpers/checkoutPixHelper.spec.ts
tests/rifas/controllers/checkoutPixController.spec.ts
tests/rifas/services/checkoutPixService.spec.ts
tests/rifas/services/checkoutPixWebhookService.spec.ts
tests/rifas/services/correcaoDadosRifasService.spec.ts
tests/tesouraria/services/pixValidacaoService.spec.ts
```
