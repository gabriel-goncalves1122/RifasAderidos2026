# AGENTS.md - Modulo Rifas

## Escopo

Este modulo e o dominio backend das rifas do aderido.

Ele cobre:

- listagem de rifas do aderido;
- venda legada por comprovante;
- correcao de dados de vendas recusadas ou com pendências;
- aliases de relatorio/historico preservados para compatibilidade.

**Regra Crítica - Correção de Dados (`correcaoDadosRifasService`):**
A alteração de bilhetes pode ser engatilhada de duas formas distintas:
1. `status === 'recusado'`: A tesouraria ativamente negou um PIX ou compra. Ao enviar a correção, a rifa deve voltar para o status transacional de `pendente`.
2. `correcao_pendente === true`: O pagamento foi feito com sucesso (está `pago`), porém há erros nos dados de cadastro (ex: nome, upload, etc.). Ao enviar a correção, o serviço deve **limpar a flag** (`correcao_pendente = null`) e preservar o `status` transacional intacto (como `pago`).

**Nota:** A geracao de novos pagamentos (Checkout Pix), webhooks de Mercado Pago e a conciliacao Pix foram unificados no modulo `tesouraria`. O frontend nunca deve chamar provedor financeiro direto.

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

```bash
cd backend/functions
npm run build
npm test -- tests/rifas
```
