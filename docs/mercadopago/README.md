# Mercado Pago Pix - Visao Geral

Este diretorio concentra a documentacao operacional da integracao Mercado Pago para
agents IA e para homologacao humana.

Escopo atual:

- Pix por QR Code e copia-e-cola;
- criacao de pedido via backend em `POST /v1/payments`;
- webhook Mercado Pago para notificacao de atualizacao de pagamento;
- conciliacao por consulta de pagamento via backend;
- Tesouraria como validacao final da compra.

Fora do escopo atual:

- cartao, boleto, checkout hospedado e deeplink Mercado Pago;
- APIs de assinatura/recorrencia;
- credenciais reais versionadas no repositorio.

## Fluxo Do Sistema

```txt
Aderido -> Frontend -> POST /rifas/checkout/pix
Backend -> reserva rifas + cria pagamentos_pix em CRIANDO
Backend -> Mercado Pago POST /v1/payments
Mercado Pago -> retorna point_of_interaction.transaction_data.qr_code (copia e cola) e qr_code_base64 (imagem)
Frontend -> mostra QR Code, Pix copia-e-cola e status
Mercado Pago -> POST /rifas/checkout/pix/webhook (action: payment.updated, data.id)
Backend -> GET /v1/payments/{id} (validação segura)
Backend -> marca banco confirmado ou libera rifas
Tesouraria -> aceita ou nega a compra como validacao final
```

O frontend nunca recebe token Mercado Pago e nunca chama endpoint externo do provedor.

## APIs Mercado Pago Necessarias

### Criar pagamento Pix

- Metodo: `POST`
- Producao/Sandbox: `https://api.mercadopago.com/v1/payments`
- Header: `Authorization: Bearer <MERCADOPAGO_ACCESS_TOKEN>`
- Header obrigatorio: `X-Idempotency-Key` (UUID v4)
- Campos usados:
  - `transaction_amount` (float);
  - `description`;
  - `payment_method_id` ("pix");
  - `payer` (email, first_name, identification);
  - `notification_url` (se necessario).

Para pedido com QR Code Pix, o pagamento e gerado automaticamente pelo Mercado Pago.

### Resposta usada pelo app

- `id` como identificador do pagamento no Mercado Pago;
- `point_of_interaction.transaction_data.qr_code` como Pix copia-e-cola;
- `point_of_interaction.transaction_data.qr_code_base64` como imagem do QR Code.

No nosso fluxo, o QR Code expira em cerca de 5 minutos para evitar reserva longa
de rifas, definido por `date_of_expiration`.

### Consultas para conciliacao

- Pagamento: `GET /v1/payments/{id}`;

A Tesouraria e os Webhooks usam essas consultas por backend para sincronizar status abertos em `pagamentos_pix`.

## Webhook

O endpoint publico do sistema e:

```txt
POST /rifas/checkout/pix/webhook
```

Regras:

- nao usa Firebase Auth;
- extrai o `data.id` e `action` (ou `type`) do payload do Mercado Pago;
- realiza consulta ativa via GET `/v1/payments/{id}` usando o Client do Mercado Pago no backend;
- processa `approved` como confirmacao bancaria;
- processa `rejected` ou `cancelled` como liberacao das rifas;
- esta abordagem garante seguranca total contra fraudes de webhook pois confiamos apenas na resposta da consulta autenticada ao Mercado Pago.

## Fontes Oficiais

- Criar pagamento: https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post
- Consultar pagamento: https://www.mercadopago.com.br/developers/pt/reference/payments/_payments_id/get

## Arquivos Deste Diretorio

- `agent-guide.md`: regras para agents manterem a integracao segura.
- `credenciais.example.md`: template sem segredos reais para homologacao.
- `thunder-client.md`: roteiro de teste manual com Thunder Client.
