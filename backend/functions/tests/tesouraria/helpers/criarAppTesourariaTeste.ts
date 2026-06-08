// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/helpers/criarAppTesourariaTeste.ts
// ============================================================================
import express, { Router } from "express";

export function criarAppTesourariaTeste(router: Router) {
  const app = express();

  app.use(express.json());
  app.use("/tesouraria", router);

  return app;
}
