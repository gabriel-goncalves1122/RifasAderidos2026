// ============================================================================
// ARQUIVO: frontend/tests/secretaria/useSecretaria.test.ts
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSecretaria } from "../../src/controllers/useSecretaria";
import { getDocs } from "firebase/firestore";
import { fetchAPI } from "../../src/controllers/api";

// 1. MOCK DO FIRESTORE
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}));

// Mock do config do Firebase para não tentar ligar a projetos reais
vi.mock("../../src/config/firebase", () => ({
  db: {},
}));

// 2. MOCK DA NOSSA API
vi.mock("../../src/controllers/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Controller: useSecretaria", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Silencia os console.error para não poluir o terminal durante os testes de falha
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("buscarAderidos()", () => {
    it("Deve buscar, formatar (com fallbacks) e ORDENAR corretamente a lista", async () => {
      // Preparamos um cenário complexo misturando ativos, pendentes e campos estranhos do CSV
      const mockDocs = [
        {
          id: "ADERIDO_003",
          data: () => ({ email: "z_pendente@teste.com", nome: "Zacarias" }), // Pendente (sem uid)
        },
        {
          id: "ADERIDO_001",
          data: () => ({
            email: "a_ativo@teste.com",
            nome: "Ana",
            uid: "uid123",
          }), // Ativo
        },
        {
          id: "ADERIDO_002",
          // Testa os fallbacks de "E-mail" maiúsculo e "Cargo" maiúsculo
          data: () => ({
            "E-mail": "b_ativo@teste.com",
            nome: "Bruno",
            uid: "uid456",
            Cargo: "Tesouraria",
          }),
        },
        {
          id: "ADERIDO_004",
          // Testa fallback de nome vazio
          data: () => ({ email: "semnome@teste.com" }),
        },
      ];

      // Simulamos o comportamento do querySnapshot do Firebase
      (getDocs as any).mockResolvedValue({
        forEach: (callback: any) => mockDocs.forEach(callback),
      });

      const { buscarAderidos } = useSecretaria();
      const resultado = await buscarAderidos();

      // Verificações de Formatação e Fallback
      expect(resultado).toHaveLength(4);

      // O Bruno usou as chaves com letra maiúscula, verificamos se o controller lidou bem com isso
      const bruno = resultado.find((r) => r.nome === "Bruno");
      expect(bruno?.email).toBe("b_ativo@teste.com");
      expect(bruno?.cargo).toBe("Tesouraria");

      // Verificações de ORDENAÇÃO:
      // Regra: Ativos primeiro, Pendentes depois, e por ordem Alfabética.
      // Ordem esperada: Ana (Ativo) -> Bruno (Ativo) -> semnome (Pendente) -> Zacarias (Pendente)
      expect(resultado[0].nome).toBe("Ana");
      expect(resultado[0].status_cadastro).toBe("ativo");

      expect(resultado[1].nome).toBe("Bruno");
      expect(resultado[1].status_cadastro).toBe("ativo");

      expect(resultado[2].email).toBe("semnome@teste.com"); // Como não tem nome, cai para 3º lugar
      expect(resultado[2].status_cadastro).toBe("pendente");

      expect(resultado[3].nome).toBe("Zacarias");
      expect(resultado[3].status_cadastro).toBe("pendente");
    });

    it("Deve atirar um erro customizado se o Firestore falhar", async () => {
      (getDocs as any).mockRejectedValue(
        new Error("Erro interno do Firestore"),
      );

      const { buscarAderidos } = useSecretaria();

      await expect(buscarAderidos()).rejects.toThrow(
        "Não foi possível carregar a lista de aderidos.",
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("adicionarAderidoIndividual()", () => {
    it("Deve chamar a fetchAPI com a rota e dados corretos em caso de sucesso", async () => {
      const mockRespostaAPI = { sucesso: true, idAderido: "ADERIDO_001" };
      (fetchAPI as any).mockResolvedValue(mockRespostaAPI);

      const { adicionarAderidoIndividual } = useSecretaria();
      const dadosMock = { email: "novo@teste.com", nome: "Teste" };

      const resultado = await adicionarAderidoIndividual(dadosMock);

      // Garante que o controller fez a ponte corretamente para o Backend
      expect(fetchAPI).toHaveBeenCalledWith(
        "/admin/aderidos",
        "POST",
        dadosMock,
      );
      expect(resultado).toEqual(mockRespostaAPI);
    });

    it("Deve capturar e repassar o erro atirado pela fetchAPI", async () => {
      // Simula a API a devolver um erro de negócio (ex: E-mail já existe)
      (fetchAPI as any).mockRejectedValue(
        new Error("Este e-mail já foi autorizado anteriormente."),
      );

      const { adicionarAderidoIndividual } = useSecretaria();

      await expect(
        adicionarAderidoIndividual({ email: "existente@teste.com" }),
      ).rejects.toThrow("Este e-mail já foi autorizado anteriormente.");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("Deve atirar erro genérico caso a API falhe sem mensagem clara", async () => {
      (fetchAPI as any).mockRejectedValue({}); // Erro vazio

      const { adicionarAderidoIndividual } = useSecretaria();

      await expect(
        adicionarAderidoIndividual({ email: "erro@teste.com" }),
      ).rejects.toThrow("Erro ao adicionar o utilizador.");
    });
  });
});
