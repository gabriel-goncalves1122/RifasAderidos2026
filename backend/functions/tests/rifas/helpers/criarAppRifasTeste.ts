// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/helpers/criarAppRifasTeste.ts
// ============================================================================
import express, { Router } from "express";

export function criarAppRifasTeste(router: Router) {
  const app = express();

  app.use(express.json());
  app.use("/rifas", router);

  return app;
}
