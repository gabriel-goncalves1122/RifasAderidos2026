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
POST /rifas/checkout/pix
GET  /rifas/checkout/pix/:id
POST /rifas/checkout/pix/webhook
POST /rifas/corrigir-dados
```

Regras:

- `/checkout/pix` exige `validateToken`;
- `/checkout/pix/webhook` nao usa Firebase Auth e valida assinatura por raw body;
- o provider externo e `shared/services/pagBankPixClient.ts`;
- o checkout reserva rifas como `reservado` ate o banco confirmar;
- banco `PAID`/`AUTHORIZED` muda rifas para `pendente`;
- banco `DECLINED`/`CANCELED` libera rifas e cria notificacao `rifa_liberada`;
- correcao de dados so atualiza rifas `recusado` do aderido logado.

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
