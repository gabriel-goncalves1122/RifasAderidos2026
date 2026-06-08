// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/relatorioRifasService.ts
// ============================================================================
import { TesourariaRelatorioService } from "../../tesouraria/services/tesourariaRelatorioService";

export class RelatorioRifasService {
  static async obterRelatorioTesouraria() {
    return TesourariaRelatorioService.obterRelatorioTesouraria();
  }

  static async obterHistoricoDetalhado() {
    return TesourariaRelatorioService.obterHistoricoDetalhado();
  }
}
