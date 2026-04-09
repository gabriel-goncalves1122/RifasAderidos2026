import { Request, Response } from "express";
import { PremiosService } from "./premiosService";

export const premiosController = {
  async obter(req: Request, res: Response) {
    try {
      return res.status(200).json(await PremiosService.listarTodos());
    } catch (e) {
      return res.status(500).json({ error: "Erro interno" });
    }
  },
  async salvarSorteio(req: Request, res: Response) {
    try {
      await PremiosService.salvarInfoSorteio(req.body);
      return res.status(200).json({ sucesso: true });
    } catch (e) {
      return res.status(500).json({ error: "Erro" });
    }
  },
  async salvarPremio(req: Request, res: Response) {
    try {
      await PremiosService.salvarPremio(req.body);
      return res.status(200).json({ sucesso: true });
    } catch (e) {
      return res.status(500).json({ error: "Erro" });
    }
  },
  async excluirPremio(req: Request, res: Response) {
    try {
      // Forçamos "as string" para acalmar o TypeScript
      await PremiosService.excluirPremio(req.params.id as string);
      return res.status(200).json({ sucesso: true });
    } catch (e) {
      return res.status(500).json({ error: "Erro interno" });
    }
  },
};
