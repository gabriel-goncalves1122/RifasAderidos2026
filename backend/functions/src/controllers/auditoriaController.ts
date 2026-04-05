import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { AuditoriaService } from "../services/auditoriaService";

export const auditoriaController = {
  // ==========================================================================
  // 1. LISTAR RIFAS PENDENTES
  // ==========================================================================
  async listarPendentes(req: AuthRequest, res: Response) {
    try {
      const bilhetesPendentes = await AuditoriaService.listarPendentes();
      return res.status(200).json({ bilhetes: bilhetesPendentes });
    } catch (error) {
      console.error("Erro ao listar rifas pendentes:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar rifas pendentes." });
    }
  },

  // ==========================================================================
  // 2. DISPARAR A INTELIGÊNCIA ARTIFICIAL (LOTE)
  // ==========================================================================
  async auditarIA(req: AuthRequest, res: Response) {
    try {
      const resultado = await AuditoriaService.auditarLoteIA();

      return res.status(200).json({
        sucesso: true,
        mensagem: `Triagem inteligente finalizada! ${resultado.preAprovados} bilhetes aprovados, ${resultado.divergentes} com divergência.`,
        dados: resultado,
      });
    } catch (error) {
      console.error("Erro na triagem em lote com IA:", error);
      return res.status(500).json({ error: "Erro interno durante a triagem." });
    }
  },

  // ==========================================================================
  // 3. APROVAR OU REJEITAR MANUALMENTE (ACAREAÇÃO)
  // ==========================================================================
  async avaliarManual(req: AuthRequest, res: Response) {
    try {
      const { numerosRifas, decisao, motivo } = req.body;

      if (
        !numerosRifas ||
        !Array.isArray(numerosRifas) ||
        numerosRifas.length === 0 ||
        !decisao
      ) {
        return res.status(400).json({
          error: "Números das rifas (array) e decisão são obrigatórios.",
        });
      }

      await AuditoriaService.processarDecisaoManual(
        numerosRifas,
        decisao,
        motivo,
      );

      return res.status(200).json({
        sucesso: true,
        mensagem: `Lote de ${numerosRifas.length} rifa(s) avaliado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao avaliar comprovante manualmente:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao avaliar comprovante." });
    }
  },
};
