import { EmailComprovanteService } from "./services/emailComprovanteService";
import { PixTransacoesService } from "./services/pixTransacoesService";
import { PixValidacaoService } from "./services/pixValidacaoService";
import { TesourariaRelatorioService } from "./services/tesourariaRelatorioService";

export class TesourariaService {
  static async obterRelatorioTesouraria() {
    return TesourariaRelatorioService.obterRelatorioTesouraria();
  }

  static async obterHistoricoDetalhado() {
    return TesourariaRelatorioService.obterHistoricoDetalhado();
  }

  static async atualizarCompradorCompra(
    compradorId: string,
    dados: {
      nome: string;
      email?: string | null;
      telefone?: string | null;
    },
  ) {
    return TesourariaRelatorioService.atualizarCompradorCompra(
      compradorId,
      dados,
    );
  }

  static async reenviarEmailComprovante(compradorId: string) {
    return EmailComprovanteService.reenviarEmailComprovante(compradorId);
  }

  static async buscarPixTransacoes() {
    return PixTransacoesService.buscarTransacoes();
  }

  static async obterPixTransacoesResumo() {
    return PixTransacoesService.obterResumo();
  }

  static async sincronizarPixTransacoes() {
    return PixTransacoesService.sincronizar();
  }

  static async aceitarPixTransacao(params: {
    transacaoId: string;
    uidTesouraria: string;
    emailTesouraria?: string;
  }) {
    return PixValidacaoService.aceitarTransacao(params);
  }

  static async negarPixTransacao(params: {
    transacaoId: string;
    uidTesouraria: string;
    emailTesouraria?: string;
    motivo?: string;
  }) {
    return PixValidacaoService.negarTransacao(params);
  }
}
