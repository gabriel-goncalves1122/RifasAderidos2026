// ============================================================================
// ARQUIVO: backend/functions/src/controllers/__tests__/rifasController.test.ts
// ============================================================================
import { rifasController } from "../src/controllers/rifasController";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

// ============================================================================
// MOCK DO FIRESTORE: Finge ser o banco de dados para testar apenas a lógica
// ============================================================================
jest.mock("firebase-admin", () => {
  const batchMock = {
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue(true),
  };
  const docMock = {
    get: jest.fn(),
  };
  const collectionMock = {
    doc: jest.fn(() => docMock),
    where: jest.fn().mockReturnThis(),
    get: jest.fn(),
  };
  return {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => collectionMock),
      batch: jest.fn(() => batchMock),
    })),
  };
});

describe("RifasController - Painel da Tesouraria", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    // Prepara uma requisição e uma resposta HTTP falsas
    mockReq = {
      body: {},
      user: { uid: "admin123", email: "admin@unifei.edu.br" },
    } as any;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // TESTE 1: Regras de Validação (Não aceitar requisições pela metade)
  it("Deve retornar erro 400 se faltar numeroRifa ou decisao na avaliacao", async () => {
    mockReq.body = { numeroRifa: "001" }; // Simulando payload faltando a "decisao"

    await rifasController.avaliarComprovante(mockReq as any, mockRes as any);

    // Garante que a API barrou o usuário com Bad Request
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Número da rifa e decisão são obrigatórios.",
    });
  });

  // TESTE 2: Regra de Negócio principal (Aprovação e gravação no banco)
  it("Deve aprovar um bilhete e mudar o status para 'pago'", async () => {
    mockReq.body = { numeroRifa: "105", decisao: "aprovar" };

    const db = admin.firestore();
    const docRef = db.collection("bilhetes").doc("105");

    // Finge que, ao buscar no banco, o bilhete 105 existe e está pendente
    (docRef.get as jest.Mock).mockResolvedValueOnce({
      exists: true,
      data: () => ({
        status: "pendente",
        comprovante_url: "http://pix.com/foto",
      }),
    });

    // Roda a função principal
    await rifasController.avaliarComprovante(mockReq as any, mockRes as any);

    // Garante que o Batch Update foi chamado com as credenciais certas
    const batch = db.batch();
    expect(batch.update).toHaveBeenCalledWith(
      docRef,
      expect.objectContaining({
        status: "pago",
      }),
    );
    // Garante que o Commit foi feito no banco
    expect(batch.commit).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
