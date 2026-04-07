// ============================================================================
// ARQUIVO: tests/notificacoesService.spec.ts (Testes do Serviço de Notificações)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const mockGet = jest.fn<any>();
const mockBatchUpdate = jest.fn<any>();
const mockBatchCommit = jest.fn<any>();
const mockBatchSet = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnValue({ id: "NOTIF_123" }),
    get: mockGet,
  };

  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock),
      batch: jest.fn().mockReturnValue({
        update: mockBatchUpdate,
        set: mockBatchSet,
        commit: mockBatchCommit,
      }),
    }),
  };
});

import { NotificacoesService } from "../src/services/notificacoesService";
// Simulamos os tipos do Firebase Batch para o TS não reclamar
import * as admin from "firebase-admin";

describe("Notificações Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================================================
  describe("buscarPorEmailAderido()", () => {
    it("Deve retornar array vazio se o usuário não for encontrado", async () => {
      mockGet.mockResolvedValueOnce({ empty: true });

      const resultado =
        await NotificacoesService.buscarPorEmailAderido("intruso@teste.com");

      expect(resultado).toEqual([]);
    });

    it("Deve retornar as notificações se o aderido existir", async () => {
      // Encontra o aderido
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_TESTE" }) }],
      });

      // Retorna as notificações
      mockGet.mockResolvedValueOnce({
        docs: [
          { id: "msg_1", data: () => ({ titulo: "Recusado", lida: false }) },
        ],
      });

      const resultado = (await NotificacoesService.buscarPorEmailAderido(
        "valido@teste.com",
      )) as any[];

      expect(resultado).toHaveLength(1);
      expect(resultado[0].titulo).toBe("Recusado");
      expect(resultado[0].id).toBe("msg_1");
    });
  });

  // ========================================================================
  describe("marcarComoLidas()", () => {
    it("Deve atualizar em lote as notificações enviadas para lida=true", async () => {
      const ids = ["id_001", "id_002"];

      await NotificacoesService.marcarComoLidas(ids);

      expect(mockBatchUpdate).toHaveBeenCalledTimes(2);
      expect(mockBatchUpdate).toHaveBeenCalledWith(
        expect.anything(), // ignora a referencia
        { lida: true },
      );
      expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    });
  });
});
