// ============================================================================
// ARQUIVO: tests/premiosService.spec.ts (Testes do Serviço de Prêmios)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ----------------------------------------------------------------------------
// 1. MOCK DO FIREBASE
// ----------------------------------------------------------------------------
const mockGet = jest.fn<any>();
const mockSet = jest.fn<any>();
const mockUpdate = jest.fn<any>();
const mockAdd = jest.fn<any>();
const mockDelete = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const docMock = {
    get: mockGet,
    set: mockSet,
    update: mockUpdate,
    delete: mockDelete,
  };

  const collectionMock = {
    doc: jest.fn().mockReturnValue(docMock),
    orderBy: jest.fn().mockReturnThis(),
    get: mockGet,
    add: mockAdd,
  };

  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock),
    }),
  };
});

// Importamos a classe após o mock estar pronto (Note o ../src/services/)
import { PremiosService } from "../src/modules/premios/premiosService";

describe("Prêmios Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================================================
  describe("listarTodos()", () => {
    it("Deve retornar as informações do sorteio e a lista de prêmios", async () => {
      // 1ª Chamada do BD: Configurações do Sorteio (Simulamos que existe)
      mockGet.mockResolvedValueOnce({
        exists: true,
        data: () => ({ titulo: "Sorteio de Natal", data: "25/12/2026" }),
      });

      // 2ª Chamada do BD: Lista de Prêmios
      mockGet.mockResolvedValueOnce({
        docs: [
          { id: "premio_1", data: () => ({ colocacao: 1, nome: "Carro" }) },
          { id: "premio_2", data: () => ({ colocacao: 2, nome: "Moto" }) },
        ],
      });

      // Adicione o 'as any' no final
      const resultado = (await PremiosService.listarTodos()) as any;

      // Verifica se a estrutura devolvida está correta
      expect(resultado).toHaveProperty("infoSorteio");
      expect(resultado).toHaveProperty("premios");

      expect(resultado.infoSorteio.titulo).toBe("Sorteio de Natal");
      expect(resultado.premios).toHaveLength(2);
      expect(resultado.premios[0].nome).toBe("Carro");
    });

    it("Deve retornar um sorteio padrão se não houver configurações salvas", async () => {
      // Simulamos que a configuração NÃO existe no banco
      mockGet.mockResolvedValueOnce({ exists: false });

      // Simulamos que também não há prêmios
      mockGet.mockResolvedValueOnce({ docs: [] });

      // Adicione o 'as any' no final
      const resultado = (await PremiosService.listarTodos()) as any;

      // Verifica se ele usou o "fallback" (Sorteio, A definir, Participe!)
      expect(resultado.infoSorteio.titulo).toBe("Sorteio");
      expect(resultado.infoSorteio.data).toBe("A definir");
      expect(resultado.premios).toHaveLength(0);
    });
  });

  // ========================================================================
  describe("salvarInfoSorteio()", () => {
    it("Deve sobrescrever as configurações do sorteio usando .set()", async () => {
      const novosDados = { titulo: "Sorteio Novo", data: "01/01/2027" };

      await PremiosService.salvarInfoSorteio(novosDados);

      expect(mockSet).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith(novosDados);
    });
  });

  // ========================================================================
  describe("salvarPremio()", () => {
    it("Deve ATUALIZAR (.update) se o prêmio já tiver um ID", async () => {
      const premioComId = {
        id: "premio_existente_123",
        nome: "Bicicleta",
        colocacao: 3,
      };

      await PremiosService.salvarPremio(premioComId);

      // Garante que tentou atualizar
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      // Garante que enviou os dados SEM o campo 'id' pra dentro do banco
      expect(mockUpdate).toHaveBeenCalledWith({
        nome: "Bicicleta",
        colocacao: 3,
      });
      expect(mockAdd).not.toHaveBeenCalled();
    });

    it("Deve ADICIONAR (.add) um novo documento se o prêmio NÃO tiver ID", async () => {
      const premioSemId = { nome: "Notebook", colocacao: 4 };

      await PremiosService.salvarPremio(premioSemId);

      // Garante que tentou criar um novo
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith(premioSemId);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  // ========================================================================
  describe("excluirPremio()", () => {
    it("Deve deletar o prêmio pelo ID usando .delete()", async () => {
      const idParaApagar = "premio_velho_999";

      await PremiosService.excluirPremio(idParaApagar);

      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
