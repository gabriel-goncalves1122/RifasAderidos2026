// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/rifasController.ts
// ============================================================================
import { corrigirRecusadas } from "./controllers/corrigirRecusadasController";
import { corrigirDadosRifas } from "./controllers/corrigirDadosRifasController";
import { consultarCheckoutPix } from "./controllers/consultarCheckoutPixController";
import { criarCheckoutPix } from "./controllers/criarCheckoutPixController";
import { getMinhasRifas } from "./controllers/getMinhasRifasController";
import { obterHistoricoDetalhado } from "./controllers/obterHistoricoDetalhadoController";
import { obterRelatorioTesouraria } from "./controllers/obterRelatorioTesourariaController";
import { processarVenda } from "./controllers/processarVendaController";
import { receberWebhookCheckoutPix } from "./controllers/receberWebhookCheckoutPixController";

export const rifasController = {
  getMinhasRifas,
  processarVenda,
  obterRelatorioTesouraria,
  obterHistoricoDetalhado,
  corrigirRecusadas,
  corrigirDadosRifas,
  criarCheckoutPix,
  consultarCheckoutPix,
  receberWebhookCheckoutPix,
};
