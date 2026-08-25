import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { AppError } from "../../../shared/classes/AppError";
import { NotificarCorrecaoDadosService } from "../services/notificarCorrecaoDadosService";

const schema = yup.object().shape({
  mensagem: yup
    .string()
    .trim()
    .required("A mensagem com o motivo da correção é obrigatória.")
    .min(5, "A mensagem deve ter pelo menos 5 caracteres."),
});

export class NotificarCorrecaoDadosController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { compradorId } = req.params;

      if (!compradorId) {
        throw new AppError("BAD_REQUEST", "O ID do comprador não foi informado.", 400);
      }

      const { mensagem } = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      await NotificarCorrecaoDadosService.notificar(compradorId as string, mensagem);

      res.status(200).json({
        sucesso: true,
        mensagem: "Notificação de correção enviada ao vendedor.",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "COMPRA_NAO_ENCONTRADA") {
          return next(new AppError("NOT_FOUND", "Nenhuma compra encontrada para este ID.", 404));
        }
        if (error.message === "COMPRA_NAO_PAGA") {
          return next(
            new AppError(
              "BAD_REQUEST",
              "Não é possível solicitar correção: a compra não está paga.",
              400
            )
          );
        }
        if (error.message === "VENDA_SEM_VENDEDOR") {
          return next(
            new AppError(
              "BAD_REQUEST",
              "Não há vendedor associado a esta compra para ser notificado.",
              400
            )
          );
        }
      }
      next(error);
    }
  }
}

export const notificarCorrecaoDados = new NotificarCorrecaoDadosController().handle;
