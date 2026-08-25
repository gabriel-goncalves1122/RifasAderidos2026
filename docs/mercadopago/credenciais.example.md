# Template De Credenciais Mercado Pago

Copie este arquivo para `docs/mercadopago/credenciais.local.md` se precisar de um
checklist local. O arquivo local deve ficar ignorado pelo git.

Nao preencha credenciais reais neste arquivo versionado.

## Ambiente

```txt
Ambiente: sandbox | producao
Responsavel:
Data:
Conta Mercado Pago:
Titular da conta:
Chave Pix ativa: sim | nao
```

## Variaveis

```txt
MERCADOPAGO_API_TOKEN=<nao-versionar>
MERCADOPAGO_API_BASE_URL=https://sandbox.api.pagseguro.com
MERCADOPAGO_WEBHOOK_TOKEN=<nao-versionar>
API_PUBLIC_BASE_URL=https://<dominio-publico>/api
```

Observacoes:

- `MERCADOPAGO_API_TOKEN` deve ficar em secret/env seguro das Functions.
- `MERCADOPAGO_WEBHOOK_TOKEN` deve ser o token usado para validar notificacoes.
- `API_PUBLIC_BASE_URL` precisa ser HTTPS publico, acessivel pelo Mercado Pago.
- Localhost nao serve para webhook real; use deploy ou tunel temporario somente
  em teste controlado.

## Validacoes Antes Da Homologacao

```txt
[ ] Token sandbox criado e ativo.
[ ] Chave Pix ativa na conta Mercado Pago.
[ ] URL publica do webhook definida.
[ ] Endpoint /rifas/checkout/pix/webhook responde sem Firebase Auth.
[ ] Assinatura x-authenticity-token validada por rawBody.
[ ] CORS nao bloqueia webhook server-to-server sem Origin.
[ ] Logs nao imprimem token, documento completo ou segredo.
[ ] npm --prefix backend/functions test -- tests/rifas passou.
[ ] npm --prefix frontend run test:run -- tests/features/aderidos passou.
```

## Promocao Para Producao

```txt
Data:
Responsavel:
Base URL producao:
Secret configurado:
Webhook publico testado:
Rollback definido:
```

Nunca cole token, chave privada, service account ou segredo neste documento.
