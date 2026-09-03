// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/helpers/criarReqResTesourariaController.ts
// ============================================================================
import { Response } from "express";
import { jest } from "@jest/globals";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";

export function criarReqResTesourariaController() {
  const req: Partial<AuthRequest> = {
    user: {
      uid: "tesouraria_123",
      email: "tesouraria@teste.com",
      role: "tesouraria",
      cargo: "tesouraria",
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
