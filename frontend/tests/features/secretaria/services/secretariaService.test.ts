// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/services/secretariaService.test.ts
// ============================================================================
import { beforeEach, describe, expect, it, vi } from "vitest";

import { secretariaService } from "@/features/secretaria/services/secretariaService";
import { fetchAPI } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Service: secretariaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar aderidos usando fetchAPI e manter a lista retornada", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce([
      {
        id: "ADERIDO_001",
        nome: "Gabriel Sampaio",
        email: "gabriel@teste.com",
        cargo: "aderido",
        modalidade_adesao: "completo",
        status_cadastro: "ativo",
      },
      {
        id: "ADERIDO_002",
        Nome: "Ana Costa",
        "E-mail": "ana@teste.com",
        Cargo: "secretaria",
        modalidade_adesao: "meio",
      },
    ]);

    const resultado = await secretariaService.buscarAderidos();

    expect(fetchAPI).toHaveBeenCalledWith("/admin/aderidos", "GET");

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

    // O normalizarAderidoSecretaria transforma Nome em nome, E-mail em email etc.
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
    vi.mocked(fetchAPI).mockRejectedValueOnce(new Error("Falha API"));

    await expect(secretariaService.buscarAderidos()).rejects.toThrow(
      "Falha API",
    );
  });
});
