// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/rifasController.ts
// ============================================================================
import { corrigirRecusadas } from "./controllers/corrigirRecusadasController";
import { corrigirDadosRifas } from "./controllers/corrigirDadosRifasController";

import { getMinhasRifas } from "./controllers/getMinhasRifasController";
import { obterHistoricoDetalhado } from "./controllers/obterHistoricoDetalhadoController";
import { obterRelatorioTesouraria } from "./controllers/obterRelatorioTesourariaController";
import { processarVenda } from "./controllers/processarVendaController";


export const rifasController = {
  getMinhasRifas,
  processarVenda,
  obterRelatorioTesouraria,
  obterHistoricoDetalhado,
  corrigirRecusadas,
  corrigirDadosRifas,
};
