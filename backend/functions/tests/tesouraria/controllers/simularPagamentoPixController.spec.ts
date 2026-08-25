// ARQUIVO: backend/functions/tests/tesouraria/controllers/simularPagamentoPixController.spec.ts

import * as admin from "firebase-admin";
import { simularPagamentoPix } from "../../../src/modules/tesouraria/controllers/simularPagamentoPixController";

jest.mock("firebase-admin", () => {
  const docMock = jest.fn();
  const collectionMock = jest.fn(() => ({ doc: docMock }));
  const runTransactionMock = jest.fn();

  return {
    firestore: jest.fn(() => ({
      collection: collectionMock,
      runTransaction: runTransactionMock,
    }))
  };
});

describe("simularPagamentoPixController", () => {
  let req: any;
  let res: any;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("deve retornar 403 se não estiver no emulador", async () => {
    process.env = { ...originalEnv, FUNCTIONS_EMULATOR: "false" };

    await simularPagamentoPix(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Endpoint disponível apenas em ambiente de desenvolvimento." });
  });

  it("deve retornar 400 se ID não for informado", async () => {
    process.env = { ...originalEnv, FUNCTIONS_EMULATOR: "true" };
    req.params = {};

    await simularPagamentoPix(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "ID do pagamento obrigatório." });
  });

  it("deve retornar 404 se o pagamento não for encontrado na transação", async () => {
    process.env = { ...originalEnv, FUNCTIONS_EMULATOR: "true" };
    req.params = { id: "pag_123" };

    const runTransactionMock = (admin.firestore().runTransaction as jest.Mock);
    runTransactionMock.mockImplementationOnce(async (callback) => {
      // simulando o erro lançado na transação
      throw new Error("PAGAMENTO_NOT_FOUND");
    });

    await simularPagamentoPix(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Pagamento não encontrado." });
  });

  it("deve retornar 200 ao simular com sucesso", async () => {
    process.env = { ...originalEnv, FUNCTIONS_EMULATOR: "true" };
    req.params = { id: "pag_123" };

    const runTransactionMock = (admin.firestore().runTransaction as jest.Mock);
    runTransactionMock.mockImplementationOnce(async (callback) => {
      // Mock da transação
      const transaction = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({ numeros_rifas: ["001", "002"], valor_bruto: 100 }),
        }),
        update: jest.fn(),
      };
      await callback(transaction);
    });

    await simularPagamentoPix(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Pagamento simulado com sucesso." });
  });

  it("deve retornar 500 em caso de erro desconhecido", async () => {
    process.env = { ...originalEnv, FUNCTIONS_EMULATOR: "true" };
    req.params = { id: "pag_123" };

    const runTransactionMock = (admin.firestore().runTransaction as jest.Mock);
    runTransactionMock.mockImplementationOnce(async () => {
      throw new Error("Erro de banco");
    });

    await simularPagamentoPix(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao simular pagamento." });
  });
});
