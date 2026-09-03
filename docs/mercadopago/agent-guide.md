# Guia Para Agents - Mercado Pago Pix

Use este guia antes de alterar checkout Pix, webhook, conciliacao ou credenciais.

## Invariantes

- Frontend chama somente o backend do sistema.
- Token Mercado Pago e URLs sensiveis nunca entram no bundle.
- Operacoes financeiras que tocam varias colecoes usam `runTransaction`.
- Webhook e a fonte de gatilho para confirmacao bancaria, mas a validacao segura exige GET em `v1/payments/{id}`.
- Polling do frontend existe apenas para feedback ao usuario.
- Tesouraria continua sendo a validacao final da compra apos o banco confirmar.

## Entry Points Atuais

Backend:

- `backend/functions/src/shared/services/mercadoPagoPixClient.ts`
- `backend/functions/src/modules/pagamentos/services/checkoutPixService.ts`
- `backend/functions/src/modules/pagamentos/services/checkoutPixWebhookService.ts`
- `backend/functions/src/modules/pagamentos/helpers/checkoutPixHelper.ts`
- `backend/functions/src/modules/pagamentos/services/pixTransacoesService.ts`
- `backend/functions/src/modules/pagamentos/services/pixValidacaoService.ts`

Frontend:

- `frontend/src/features/aderidos/services/checkoutPixService.ts`
- `frontend/src/features/aderidos/hooks/useCheckoutPixFlow.ts`
- `frontend/src/features/aderidos/CheckoutModal.tsx`
- `frontend/src/features/aderidos/components/checkout/CheckoutPixBox.tsx`

## Contrato Backend -> Mercado Pago

Criacao:

```txt
POST /v1/payments
Authorization: Bearer <MERCADOPAGO_ACCESS_TOKEN>
X-Idempotency-Key: <uuid>
```

Payload minimo esperado:

```json
{
  "transaction_amount": 10.50,
  "description": "Rifas 00001, 00002",
  "payment_method_id": "pix",
  "payer": {
    "email": "user@example.com",
    "first_name": "Nome",
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  }
}
```

Para o Pix QR Code deste fluxo, o campo `payment_method_id` com o valor `"pix"` e crucial.

Resposta normalizada:

- `id` do pedido Mercado Pago vira `pix_order_id`;
- `point_of_interaction.transaction_data.qr_code` vira `copia_e_cola`;
- `point_of_interaction.transaction_data.qr_code_base64` vira imagem do QR Code.

## Concorrencia E Idempotencia

O checkout deve manter duas fases:

1. transacao local reserva rifas e cria `pagamentos_pix` em `CRIANDO`;
2. backend chama Mercado Pago com a chave idempotente;
3. transacao final grava pedido, QR Code, copia-e-cola e status `pending`.

Se o usuario clicar duas vezes ou abrir duas abas, a chave em
`pagamentos_pix_idempotencia` deve reaproveitar cobranca ativa quando possivel.

Se o Mercado Pago falhar antes de devolver um pedido valido, compense liberando as
rifas dentro de transacao e marque `ERRO_CRIACAO`.

Se o Mercado Pago criar pedido mas a finalizacao local falhar, preserve
o `pix_order_id` sempre que existir para permitir recuperacao
por sincronizacao.

## Webhook

Processamento seguro esperado:

- Webhook recebe `id` do pagamento (`data.id`)
- Nao confia no payload do Webhook para dados criticos.
- O backend consulta `GET /v1/payments/{id}` usando o Client do Mercado Pago.
- `approved`: pagamento confirmado pelo banco, rifas vao para
  `pendente` aguardando Tesouraria;
- `rejected`/`cancelled`: rifas voltam para `disponivel` e o aderido recebe
  notificacao `rifa_liberada`;
- payload repetido: ignora se o status for o mesmo, senao atualiza as colecoes adequadamente sem duplicar efeitos.

## Checklist Antes De Alterar

- Conferir `AGENTS.md` raiz e do modulo.
- Conferir se a mudanca exige schema Yup.
- Conferir se a rota exporta tipos de request/response.
- Conferir se nao ha chamada frontend direta para Mercado Pago.
- Conferir se nenhum log imprime token, Pix copia-e-cola completo em contexto
  indevido, CPF completo ou payload sensivel.
- Rodar testes focados de `tests/pagamentos/` e `tests/tesouraria/`.
