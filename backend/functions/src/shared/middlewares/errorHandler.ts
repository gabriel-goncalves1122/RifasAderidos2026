import { Request, Response, NextFunction } from "express";

import { AppError } from "../classes/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: "Formato JSON inválido na requisição.",
      code: "INVALID_JSON",
    });
    return;
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "Erro interno do servidor."
      : String(err);

  console.error("[ErrorHandler]", err);

  res.status(500).json({
    error: message,
    code: "INTERNAL_ERROR",
  });
}
