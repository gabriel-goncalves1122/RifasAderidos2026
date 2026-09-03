// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/rifasService.ts
// ============================================================================
import { Bilhete } from "../types/models";

import { DadosCorrecaoRifas, DadosVenda } from "./types/rifasTypes";
import { DadosCorrecaoDadosRifas } from "./types/rifasTypes";

import { AderidoRifasService } from "./services/aderidoRifasService";
import { VendaRifasService } from "./services/vendaRifasService";
import { CorrecaoRifasService } from "./services/correcaoRifasService";
import { RelatorioRifasService } from "./services/relatorioRifasService";
import { CorrecaoDadosRifasService } from "./services/correcaoDadosRifasService";

export class RifasService {
  static async buscarPorAderido(emailLogado: string): Promise<Bilhete[]> {
    return AderidoRifasService.buscarPorAderido(emailLogado);
  }

  static async processarVenda(
    uid: string,
    emailLogado: string,
    dadosVenda: DadosVenda,
  ): Promise<void> {
    return VendaRifasService.processarVenda(uid, emailLogado, dadosVenda);
  }

  static async corrigirRifasRecusadas(
    emailLogado: string,
    numerosRifas: string[],
    dadosAtualizados: DadosCorrecaoRifas,
  ): Promise<boolean> {
    return CorrecaoRifasService.corrigirRifasRecusadas(
      emailLogado,
      numerosRifas,
      dadosAtualizados,
    );
  }

  static async corrigirDadosRifasRecusadas(
    emailLogado: string,
    numerosRifas: string[],
    dadosAtualizados: DadosCorrecaoDadosRifas,
  ): Promise<boolean> {
    return CorrecaoDadosRifasService.corrigirDadosRifasRecusadas(
      emailLogado,
      numerosRifas,
      dadosAtualizados,
    );
  }


  static async obterRelatorioTesouraria() {
    return RelatorioRifasService.obterRelatorioTesouraria();
  }

  static async obterHistoricoDetalhado() {
    return RelatorioRifasService.obterHistoricoDetalhado();
  }
}
