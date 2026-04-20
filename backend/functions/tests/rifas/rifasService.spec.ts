// ============================================================================
// ARQUIVO: backend/tests/rifasService.spec.ts (Testes de Regra de Negócio)
// ============================================================================
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

// ----------------------------------------------------------------------------
// 1. MOCK DO FIREBASE E SERVIÇOS EXTERNOS
// ----------------------------------------------------------------------------
const mockGet = jest.fn<any>();
const mockDocGet = jest.fn<any>();
const mockBatchSet = jest.fn<any>();
const mockBatchUpdate = jest.fn<any>();
const mockBatchCommit = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnValue({
      id: "DOC_ID_FALSO_123",
      get: mockDocGet,
    }),
    get: mockGet,
  };

  const firestoreMock: any = jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(collectionMock),
    batch: jest.fn().mockReturnValue({
      set: mockBatchSet,
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    }),
  });

  // <-- CORREÇÃO: Ensina o mock a conhecer o FieldValue.delete()
  firestoreMock.FieldValue = {
    delete: jest.fn().mockReturnValue("MOCK_DELETE_CMD"),
  };

  return {
    firestore: firestoreMock,
  };
});

jest.mock("../../src/modules/rifas/emailService", () => ({
  enviarEmailRecibo: jest.fn(),
}));

import { RifasService } from "../../src/modules/rifas/rifasService";
import { enviarEmailRecibo } from "../../src/modules/rifas/emailService";

describe("Rifas Service - Lógica de Negócio", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("buscarPorAderido()", () => {
    it("Deve lançar erro USER_NOT_FOUND se o email não estiver na base oficial", async () => {
      mockGet.mockResolvedValueOnce({ empty: true });
      await expect(
        RifasService.buscarPorAderido("intruso@teste.com"),
      ).rejects.toThrow("USER_NOT_FOUND");
    });

    it("Deve retornar os bilhetes ordenados numericamente se o usuário existir", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_001" }) }],
      });
      mockGet.mockResolvedValueOnce({
        docs: [
          { data: () => ({ numero: "005", status: "pendente" }) },
          { data: () => ({ numero: "001", status: "pago" }) },
        ],
      });

      const resultado = await RifasService.buscarPorAderido("valido@teste.com");
      expect(resultado).toHaveLength(2);
      expect(resultado[0].numero).toBe("001");
      expect(resultado[1].numero).toBe("005");
    });
  });

  describe("processarVenda()", () => {
    it("Deve lançar erro INVALID_DATA se faltarem informações cruciais", async () => {
      const dadosIncompletos = {
        nome: "Comprador Teste",
        telefone: "11999999999", // <-- CORREÇÃO DO TYPESCRIPT: Adicionado o telefone obrigatório
        numerosRifas: [],
        comprovanteUrl: "",
      };

      await expect(
        RifasService.processarVenda(
          "uid_123",
          "vendedor@teste.com",
          dadosIncompletos,
        ),
      ).rejects.toThrow("INVALID_DATA");

      expect(mockBatchCommit).not.toHaveBeenCalled();
    });

    it("Deve criar o comprador, atualizar as rifas e disparar o e-mail de sucesso", async () => {
      const dadosVenda = {
        nome: "Engenheiro Comprador",
        telefone: "35999999999",
        email: "comprador@teste.com",
        numerosRifas: ["010", "011"],
        comprovanteUrl: "https://meu-comprovante.png",
      };

      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            data: () => ({
              nome: "Vendedor Teste",
              cpf: "123.456.789-00",
              id_aderido: "ADERIDO_999",
            }),
          },
        ],
      });
      mockBatchCommit.mockResolvedValueOnce(true);

      await RifasService.processarVenda(
        "uid_123",
        "vendedor@teste.com",
        dadosVenda,
      );

      expect(mockBatchCommit).toHaveBeenCalledTimes(1);
      expect(mockBatchSet).toHaveBeenCalledTimes(3);
      expect(enviarEmailRecibo).toHaveBeenCalledWith(
        "comprador@teste.com",
        "Engenheiro Comprador",
        ["010", "011"],
        "pendente",
      );
    });
  });

  describe("corrigirRifasRecusadas()", () => {
    const dadosAtualizados = {
      nome: "Comprador Corrigido",
      telefone: "11999999999",
      email: "novo@email.com",
      comprovanteUrl: "https://novo-comprovativo.pdf",
    };

    it("Deve lançar erro USER_NOT_FOUND se o email logado não for encontrado", async () => {
      mockGet.mockResolvedValueOnce({ empty: true });
      await expect(
        RifasService.corrigirRifasRecusadas(
          "fantasma@teste.com",
          ["010"],
          dadosAtualizados,
        ),
      ).rejects.toThrow("USER_NOT_FOUND");
    });

    it("Deve bloquear a correção se a rifa não pertencer ao Aderido ou não estiver recusada", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_030" }) }],
      });
      mockDocGet.mockResolvedValueOnce({
        exists: true,
        data: () => ({ vendedor_id: "ADERIDO_999", status: "recusado" }),
      });

      await RifasService.corrigirRifasRecusadas(
        "valido@teste.com",
        ["010"],
        dadosAtualizados,
      );
      expect(mockBatchUpdate).not.toHaveBeenCalled();
      expect(mockBatchCommit).toHaveBeenCalled();
    });

    it("Deve processar a correção com sucesso se o dono for válido e a rifa estiver recusada", async () => {
      // 1. Simula o utilizador logado (ADERIDO_030)
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_030" }) }],
      });

      // 2. Simula a leitura da rifa (O dono bate certo e o status é 'recusado')
      mockDocGet.mockResolvedValueOnce({
        exists: true,
        data: () => ({
          vendedor_id: "ADERIDO_030",
          status: "recusado",
        }),
      });

      const sucesso = await RifasService.corrigirRifasRecusadas(
        "valido@teste.com",
        ["010"],
        dadosAtualizados,
      );

      expect(sucesso).toBe(true);

      // <-- CORREÇÃO: O expect agora espera 'null' conforme a última mudança no Service
      expect(mockBatchUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "pendente",
          comprador_nome: "Comprador Corrigido",
          comprovante_url: "https://novo-comprovativo.pdf",
          motivo_recusa: null, // Alterado de MOCK_DELETE_CMD para null
          log_automacao: null, // Alterado de MOCK_DELETE_CMD para null
        }),
      );
      expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    });

    it("Deve atirar erro de falha caso o commit no banco crashe", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_030" }) }],
      });
      mockDocGet.mockResolvedValueOnce({
        exists: true,
        data: () => ({ vendedor_id: "ADERIDO_030", status: "recusado" }),
      });

      mockBatchCommit.mockRejectedValueOnce(new Error("Firebase Offline"));

      await expect(
        RifasService.corrigirRifasRecusadas(
          "valido@teste.com",
          ["010"],
          dadosAtualizados,
        ),
      ).rejects.toThrow("Falha ao salvar a correção no banco de dados.");
    });
  });
});
