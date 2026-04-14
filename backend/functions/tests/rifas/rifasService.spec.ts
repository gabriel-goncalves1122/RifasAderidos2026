// ============================================================================
// ARQUIVO: tests/rifasService.spec.ts (Testes de Regra de Negócio)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ----------------------------------------------------------------------------
// 1. MOCK DO FIREBASE E SERVIÇOS EXTERNOS
// ----------------------------------------------------------------------------
const mockGet = jest.fn<any>();
const mockBatchSet = jest.fn<any>();
const mockBatchCommit = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnValue({ id: "DOC_ID_FALSO_123" }),
    get: mockGet,
  };

  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock),
      batch: jest.fn().mockReturnValue({
        set: mockBatchSet,
        update: jest.fn(),
        commit: mockBatchCommit,
      }),
    }),
  };
});

// Simulamos o serviço de email para não enviar e-mails de verdade durante o teste
jest.mock("../../src/modules/rifas/emailService", () => ({
  enviarEmailRecibo: jest.fn(),
}));

// Só importamos os nossos arquivos DEPOIS dos mocks estarem montados
import { RifasService } from "../../src/modules/rifas/rifasService";
import { enviarEmailRecibo } from "../../src/modules/rifas/emailService";

describe("Rifas Service - Lógica de Negócio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================================================
  // MÉTODO: buscarPorAderido
  // ========================================================================
  describe("buscarPorAderido()", () => {
    it("Deve lançar erro USER_NOT_FOUND se o email não estiver na base oficial", async () => {
      // Simulamos a primeira busca (procurar usuário) retornando vazio
      mockGet.mockResolvedValueOnce({ empty: true });

      await expect(
        RifasService.buscarPorAderido("intruso@teste.com"),
      ).rejects.toThrow("USER_NOT_FOUND");
    });

    it("Deve retornar os bilhetes ordenados numericamente se o usuário existir", async () => {
      // 1ª Chamada do banco: Procurar o usuário pelo email
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_001" }) }],
      });

      // 2ª Chamada do banco: Buscar os bilhetes desse aderido (mandamos fora de ordem de propósito)
      mockGet.mockResolvedValueOnce({
        docs: [
          { data: () => ({ numero: "005", status: "pendente" }) },
          { data: () => ({ numero: "001", status: "pago" }) },
        ],
      });

      const resultado = await RifasService.buscarPorAderido("valido@teste.com");

      // Verificamos se ele ordenou o "001" antes do "005"
      expect(resultado).toHaveLength(2);
      expect(resultado[0].numero).toBe("001");
      expect(resultado[1].numero).toBe("005");
    });
  });

  // ========================================================================
  // MÉTODO: processarVenda
  // ========================================================================
  describe("processarVenda()", () => {
    it("Deve lançar erro INVALID_DATA se faltarem informações cruciais (comprovante ou números)", async () => {
      const dadosIncompletos = {
        nome: "Comprador Teste",
        numerosRifas: [], // Erro: array vazio
        comprovanteUrl: "", // Erro: sem comprovante
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
      // ARRANGE
      const dadosVenda = {
        nome: "Engenheiro Comprador",
        telefone: "35999999999",
        email: "comprador@teste.com",
        numerosRifas: ["010", "011"],
        comprovanteUrl: "https://meu-comprovante.png",
      };

      // Simulamos a busca do Vendedor no banco para pegar o Nome e CPF dele
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [
          { data: () => ({ nome: "Vendedor Teste", cpf: "123.456.789-00" }) },
        ],
      });

      mockBatchCommit.mockResolvedValueOnce(true);

      // ACT
      await RifasService.processarVenda(
        "uid_123",
        "vendedor@teste.com",
        dadosVenda,
      );

      // ASSERT
      // 1. O Batch deve ter sido salvo
      expect(mockBatchCommit).toHaveBeenCalledTimes(1);

      // 2. O .set() do batch deve ter sido chamado 3 vezes
      // (1 vez para o novo comprador + 2 vezes para as duas rifas compradas)
      expect(mockBatchSet).toHaveBeenCalledTimes(3);

      // 3. O e-mail de "pendente" deve ter sido enfileirado para envio
      expect(enviarEmailRecibo).toHaveBeenCalledWith(
        "comprador@teste.com",
        "Engenheiro Comprador",
        ["010", "011"],
        "pendente",
      );
    });
  });
});
