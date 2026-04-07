import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { RifasService } from "../services/rifasService";

export const rifasController = {
  // ==========================================================================
  // 1. BUSCAR AS RIFAS DO ADERIDO LOGADO
  // ==========================================================================
  async getMinhasRifas(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.email) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const bilhetes = await RifasService.buscarPorAderido(req.user.email);
      return res.status(200).json({ bilhetes });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") {
        return res
          .status(404)
          .json({ error: "Você não está na lista de aderidos oficiais." });
      }
      console.error("Erro ao buscar rifas:", error);
      return res.status(500).json({ error: "Erro interno ao buscar rifas." });
    }
  },

  // ==========================================================================
  // 2. REGISTRAR UMA NOVA VENDA
  // ==========================================================================
  async processarVenda(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.uid || !req.user?.email) {
        return res.status(401).json({ error: "Não autorizado." });
      }

      await RifasService.processarVenda(req.user.uid, req.user.email, req.body);

      return res.status(200).json({
        sucesso: true,
        mensagem: "Venda registrada com sucesso! Comprovante em análise.",
      });
    } catch (error: any) {
      if (error.message === "INVALID_DATA") {
        return res
          .status(400)
          .json({ error: "Dados incompletos ou comprovante faltando." });
      }
      console.error("Erro ao processar venda:", error);
      return res.status(500).json({ error: "Erro ao processar a venda." });
    }
  },

  // ==========================================================================
  // 3. OBTER RELATÓRIO GERAL (TESOURARIA)
  // ==========================================================================
  async obterRelatorioTesouraria(req: AuthRequest, res: Response) {
    try {
      const relatorio = await RifasService.obterRelatorioTesouraria();
      return res.status(200).json(relatorio);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      return res.status(500).json({ error: "Erro ao gerar relatório." });
    }
  },

  // ==========================================================================
  // 4. OBTER HISTÓRICO GRANULAR (TESOURARIA)
  // ==========================================================================
  async obterHistoricoDetalhado(req: AuthRequest, res: Response) {
    try {
      const historico = await RifasService.obterHistoricoDetalhado();
      return res.status(200).json({ historico });
    } catch (error) {
      console.error("Erro ao gerar histórico detalhado:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o histórico de vendas." });
    }
  },
};
