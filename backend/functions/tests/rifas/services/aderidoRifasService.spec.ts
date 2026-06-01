// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/services/aderidoRifasService.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockGet = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: mockGet,
  };

  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock),
    }),
  };
});

import { AderidoRifasService } from "../../../src/modules/rifas/services/aderidoRifasService";

describe("Service: AderidoRifasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve lançar USER_NOT_FOUND se o e-mail não estiver na base oficial", async () => {
    mockGet.mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    await expect(
      AderidoRifasService.buscarPorAderido("intruso@teste.com"),
    ).rejects.toThrow("USER_NOT_FOUND");
  });

  it("Deve retornar os bilhetes ordenados numericamente quando o usuário existir", async () => {
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: "DOC_USUARIO_001",
          data: () => ({
            id_aderido: "ADERIDO_001",
          }),
        },
      ],
    });

    mockGet.mockResolvedValueOnce({
      docs: [
        { data: () => ({ numero: "005", status: "pendente" }) },
        { data: () => ({ numero: "001", status: "pago" }) },
      ],
    });

    const resultado = await AderidoRifasService.buscarPorAderido(
      "valido@teste.com",
    );

    expect(resultado).toHaveLength(2);
    expect(resultado[0].numero).toBe("001");
    expect(resultado[1].numero).toBe("005");
  });

  it("Deve usar o ID do documento como fallback quando não houver id_aderido", async () => {
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: "UID_DOCUMENTO_001",
          data: () => ({}),
        },
      ],
    });

    mockGet.mockResolvedValueOnce({
      docs: [{ data: () => ({ numero: "010", status: "disponivel" }) }],
    });

    const resultado = await AderidoRifasService.buscarPorAderido(
      "valido@teste.com",
    );

    expect(resultado).toEqual([{ numero: "010", status: "disponivel" }]);
  });
});
