// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/helpers/criarReqResRifasController.ts
// ============================================================================
import { Response } from "express";
import { jest } from "@jest/globals";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";

export function criarReqResRifasController() {
  const req: Partial<AuthRequest> = {
    user: {
      uid: "user_123",
      email: "teste@teste.com",
    } as any,
    body: {},
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis() as any,
    json: jest.fn() as any,
  };

  return {
    req,
    res,
  };
}
