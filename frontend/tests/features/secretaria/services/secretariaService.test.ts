// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/services/secretariaService.test.ts
// ============================================================================
import { beforeEach, describe, expect, it, vi } from "vitest";

import { secretariaService } from "@/features/secretaria/services/secretariaService";
import { fetchAPI } from "@/shared/services/api";

const mockCollection = vi.fn();
const mockGetDocs = vi.fn();

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
}));

vi.mock("@/shared/config/firebase", () => ({
  db: {
    app: {
      name: "firestore-mock",
    },
  },
}));

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

function criarDocMock(id: string, dados: Record<string, unknown>) {
  return {
    id,
    data: () => dados,
  };
}

describe("Service: secretariaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCollection.mockReturnValue({
      path: "usuarios",
    });
  });

  it("Deve buscar aderidos e mapear documentos antigos e novos", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        criarDocMock("ADERIDO_001", {
          nome: "Gabriel Sampaio",
          email: "gabriel@teste.com",
          cargo: "aderido",
          modalidade_adesao: "completo",
          uid: "uid-001",
          telefone: "(35) 99999-9999",
        }),
        criarDocMock("ADERIDO_002", {
          Nome: "Ana Costa",
          "E-mail": "ana@teste.com",
          Cargo: "secretaria",
          modalidade_adesao: "meio",
          uid: null,
        }),
      ],
    });

    const resultado = await secretariaService.buscarAderidos();

    expect(mockCollection).toHaveBeenCalled();
    expect(mockGetDocs).toHaveBeenCalled();

    expect(resultado).toHaveLength(2);

    expect(resultado[0]).toEqual(
      expect.objectContaining({
        id: "ADERIDO_001",
        nome: "Gabriel Sampaio",
        email: "gabriel@teste.com",
        cargo: "aderido",
        modalidade_adesao: "completo",
        status_cadastro: "ativo",
      }),
    );

    expect(resultado[1]).toEqual(
      expect.objectContaining({
        id: "ADERIDO_002",
        nome: "Ana Costa",
        email: "ana@teste.com",
        cargo: "secretaria",
        modalidade_adesao: "meio",
        status_cadastro: "pendente",
      }),
    );
  });

  it("Deve ordenar ativos antes de pendentes", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        criarDocMock("ADERIDO_001", {
          nome: "Pendente",
          email: "pendente@teste.com",
          uid: null,
        }),
        criarDocMock("ADERIDO_002", {
          nome: "Ativo",
          email: "ativo@teste.com",
          uid: "uid-ativo",
        }),
      ],
    });

    const resultado = await secretariaService.buscarAderidos();

    expect(resultado[0].nome).toBe("Ativo");
    expect(resultado[1].nome).toBe("Pendente");
  });

  it("Deve adicionar aderido individual via API", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      sucesso: true,
      idAderido: "ADERIDO_010",
    });

    const dados = {
      nome: "Novo Aderido",
      email: "novo@teste.com",
      modalidade_adesao: "completo",
      cargo: "aderido",
    };

    const resultado = await secretariaService.adicionarAderidoIndividual(
      dados as any,
    );

    expect(fetchAPI).toHaveBeenCalledWith("/admin/aderidos", "POST", dados);
    expect(resultado).toEqual({
      sucesso: true,
      idAderido: "ADERIDO_010",
    });
  });

  it("Deve atualizar aderido via API", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      sucesso: true,
    });

    const dados = {
      nome: "Gabriel Atualizado",
      telefone: "(35) 98888-8888",
      cargo: "aderido",
    };

    const resultado = await secretariaService.atualizarAderidoSecretaria(
      "ADERIDO_001",
      dados as any,
    );

    expect(fetchAPI).toHaveBeenCalledWith(
      "/admin/aderidos/ADERIDO_001",
      "PUT",
      dados,
    );

    expect(resultado).toEqual({
      sucesso: true,
    });
  });

  it("Deve repassar o erro original quando a busca falhar", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("Falha Firestore"));

    await expect(secretariaService.buscarAderidos()).rejects.toThrow(
      "Falha Firestore",
    );
  });
});
