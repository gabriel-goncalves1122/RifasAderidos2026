# Thunder Client - Teste Mercado Pago Pix

Use este roteiro para testar o backend do sistema. O Thunder Client nao deve
chamar Mercado Pago diretamente no fluxo principal do app.

## Preparacao

Suba os emuladores/backend local:

```bash
npm run dev:backend:local
```

Configure variaveis do ambiente Thunder:

```txt
baseUrl=http://127.0.0.1:5001/rifasaderidos2026/us-central1/api
firebaseToken=<id-token-do-aderido>
tesourariaToken=<id-token-tesouraria-ou-admin>
pagamentoId=<preencher-apos-criar>
```

## 1. Gerar Pix

```http
POST {{baseUrl}}/rifas/checkout/pix
Authorization: Bearer {{firebaseToken}}
Content-Type: application/json

{
  "nome": "Comprador Teste",
  "telefone": "35999990000",
  "email": "comprador@teste.com",
  "documento": "12345678909",
  "numerosRifas": ["001"]
}
```

Esperado:

- `id`;
- `status`;
- `copiaECola`;
- `qrCodeImagemUrl`;
- `expiraEm`.

Salve `id` em `pagamentoId`.

## 2. Consultar Status Do Checkout

```http
GET {{baseUrl}}/rifas/checkout/pix/{{pagamentoId}}
Authorization: Bearer {{firebaseToken}}
```

Esperado antes do webhook:

```txt
status = aguardando_pagamento
```

## 3. Simular Webhook Pago

O script local assina o payload com `MERCADOPAGO_WEBHOOK_TOKEN` e envia para o
endpoint do backend.

```bash
MERCADOPAGO_WEBHOOK_TOKEN=<token-local> \
node backend/functions/scripts/simular-webhook-pix.js \
  --order ORDE_TESTE_001 \
  --reference rifas-pix-COMPRADOR_001 \
  --status PAID
```

Depois, consulte novamente:

```http
GET {{baseUrl}}/rifas/checkout/pix/{{pagamentoId}}
Authorization: Bearer {{firebaseToken}}
```

Esperado:

```txt
status = pago
```

Na Tesouraria, a transacao deve aparecer para validacao manual.

## 4. Simular Cancelamento Ou Recusa Bancaria

```bash
MERCADOPAGO_WEBHOOK_TOKEN=<token-local> \
node backend/functions/scripts/simular-webhook-pix.js \
  --order ORDE_TESTE_002 \
  --reference rifas-pix-COMPRADOR_002 \
  --status CANCELED \
  --motivo "Pagamento cancelado pelo banco."
```

Esperado:

- rifas voltam para `disponivel`;
- notificacao `rifa_liberada` e criada para o aderido.

## 5. Sincronizar Tesouraria

```http
POST {{baseUrl}}/tesouraria/transacoes-bancarias/sincronizar
Authorization: Bearer {{tesourariaToken}}
Content-Type: application/json

{}
```

Use quando houver cobrancas abertas em `pagamentos_pix` e for necessario
recuperar estado pelo Mercado Pago via backend.

## 6. Validar Na Tesouraria

Aceitar:

```http
POST {{baseUrl}}/tesouraria/transacoes-bancarias/<transacaoId>/aceitar
Authorization: Bearer {{tesourariaToken}}
Content-Type: application/json

{}
```

Negar:

```http
POST {{baseUrl}}/tesouraria/transacoes-bancarias/<transacaoId>/negar
Authorization: Bearer {{tesourariaToken}}
Content-Type: application/json

{
  "motivo": "Dados do comprador precisam de correcao."
}
```

## Falhas Que Devem Ser Testadas

- gerar Pix duas vezes para as mesmas rifas;
- tentar comprar rifa ja reservada;
- webhook com assinatura invalida;
- webhook com payload reformatado;
- webhook duplicado `PAID`;
- QR expirado sem pagamento;
- sincronizacao com Mercado Pago indisponivel.
