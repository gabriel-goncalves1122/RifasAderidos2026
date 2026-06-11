// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/tesourariaController.ts
// ============================================================================
import { aceitarPixTransacao } from "./controllers/aceitarPixTransacaoController";
import { atualizarCompradorCompra } from "./controllers/atualizarCompradorCompraController";
import { listarPixTransacoes } from "./controllers/listarPixTransacoesController";
import { negarPixTransacao } from "./controllers/negarPixTransacaoController";
import { obterHistoricoTesouraria } from "./controllers/obterHistoricoTesourariaController";
import { obterPixTransacoesResumo } from "./controllers/obterPixTransacoesResumoController";
import { obterRelatorioTesouraria } from "./controllers/obterRelatorioTesourariaController";
import { reenviarEmailComprovante } from "./controllers/reenviarEmailComprovanteController";
import { sincronizarPixTransacoes } from "./controllers/sincronizarPixTransacoesController";

export const tesourariaController = {
  atualizarCompradorCompra,
  reenviarEmailComprovante,
  obterRelatorioTesouraria,
  obterHistoricoTesouraria,
  listarPixTransacoes,
  obterPixTransacoesResumo,
  sincronizarPixTransacoes,
  aceitarPixTransacao,
  negarPixTransacao,
};
