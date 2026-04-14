import { Response } from "express";
import { AuthRequest } from "../../shared/middlewares/authMiddleware";
import { adminService } from "./adminService";

export const adminController = {
  async adicionarAderido(req: AuthRequest, res: Response): Promise<any> {
    try {
      const dadosNovos = req.body;

      if (!dadosNovos.email) {
        return res.status(400).json({ error: "O e-mail é obrigatório." });
      }

      // Passa a bola para o serviço que contém a regra de negócio
      const resultado = await adminService.adicionarAderido(dadosNovos);

      return res.status(201).json({
        sucesso: true,
        mensagem: "Aderido e bilhetes gerados com sucesso!",
        ...resultado,
      });
    } catch (error: any) {
      console.error("[Admin Controller] Erro ao adicionar aderido:", error);
      // Retorna 400 se for um erro conhecido (ex: E-mail já existe), ou 500 se for erro interno
      return res
        .status(400)
        .json({ error: error.message || "Erro desconhecido." });
    }
  },
};
