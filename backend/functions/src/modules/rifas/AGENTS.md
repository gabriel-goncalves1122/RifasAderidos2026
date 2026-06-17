# AGENTS.md - Modulo Rifas

## Escopo

Este modulo e o dominio backend das rifas do aderido.

Ele cobre:

- listagem de rifas do aderido;
- venda legada por comprovante;
- checkout Pix via backend do sistema;
- webhook Pix assinado;
- correcao de dados de vendas recusadas;
- aliases de relatorio/historico preservados para compatibilidade.

O frontend nunca deve chamar provedor financeiro direto. Pix externo fica isolado
em services/provider backend.

## Estrutura

```txt
modules/rifas/
├── AGENTS.md
├── rifasController.ts
├── rifasRoutes.ts
├── rifasService.ts
├── controllers/
├── helpers/
├── routes/
├── services/
└── types/
```

## Checkout Pix

Rotas canonicas:

```txt
POST /rifas/checkout/pix           (validateToken + validate(checkoutPixSchema))
GET  /rifas/checkout/pix/:id       (validateToken)
POST /rifas/checkout/pix/webhook   (raw body, assinatura HMAC-SHA256)
POST /rifas/corrigir-dados
```

Regras:

- `/checkout/pix` exige `validateToken` + schema validation via yup;
- `/checkout/pix/webhook` nao usa Firebase Auth e valida assinatura por raw body;
  - header: `x-pagbank-signature` (fallback: `x-authenticity-token`);
  - algoritmo: HMAC-SHA256 com `PAGBANK_WEBHOOK_TOKEN` como chave, raw body como mensagem;
  - output: base64.
- o provider externo e `shared/services/pagBankPixClient.ts`;
- o checkout faz **pre-check** de disponibilidade antes de chamar PagBank
  (para evitar chamada desnecessaria), mas re-valida cada rifa DENTRO da
  `runTransaction` para eliminar TOCTOU;
- o checkout reserva rifas como `reservado` ate o banco confirmar;
- banco `PAID`/`AUTHORIZED` muda rifas para `pendente`;
- banco `DECLINED`/`CANCELED` libera rifas e cria notificacao `rifa_liberada`;
- correcao de dados so atualiza rifas `recusado` do aderido logado.

**ACID:** tanto o checkout (reserva atomica + criacao do pagamento) quanto o webhook
(atualizacao de status + notificacao) DEVEM usar `runTransaction` do Firestore para
garantir consistencia. Nunca atualize rifas e crie notificacoes em operacoes separadas.

## Polling (Frontend)

Apos `POST /rifas/checkout/pix`, o frontend inicia polling a cada 10s por ate
36 tentativas (~6 min) contra `GET /rifas/checkout/pix/:id`. O service
`checkoutPixService.consultarCobrancaPix` implementa a consulta no backend.

O banco PagBank pode levar de alguns segundos a alguns minutos para processar.
O polling evita que o usuario precise recarregar a pagina manualmente.

## Compatibilidade

Nao remova nem quebre:

```txt
POST /rifas/vender
POST /rifas/corrigir
GET  /rifas/relatorio
GET  /rifas/historico
```

Campos novos em `bilhetes` devem ser opcionais para dados legados.

## Tests

Testes especificos ficam em `backend/functions/tests/rifas`.

Ao alterar checkout Pix, rode pelo menos:

```bash
cd backend/functions
npm run build
npm test -- tests/rifas
```
