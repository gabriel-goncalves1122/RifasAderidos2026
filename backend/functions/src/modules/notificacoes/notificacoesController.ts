import { Response } from "express";
import { AuthRequest } from "../../shared/middlewares/authMiddleware";
import { NotificacoesService } from "./notificacoesService";

export const notificacoesController = {
  async obter(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.email)
        return res.status(401).json({ error: "Não autorizado" });
      const notificacoes = await NotificacoesService.buscarPorEmailAderido(
        req.user.email,
      );
      return res.status(200).json({ notificacoes });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  },

  async marcarLidas(req: AuthRequest, res: Response) {
    try {
      const { ids } = req.body;
      const email = req.user?.email;

      if (!email) return res.status(401).json({ error: "Não autorizado" });
      if (!Array.isArray(ids))
        return res.status(400).json({ error: "IDs inválidos" });

      await NotificacoesService.marcarComoLidas(ids, email);
      return res.status(200).json({ sucesso: true });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  },
};
