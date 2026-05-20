// ============================================================================
// ARQUIVO: frontend/tests/secretaria/useSecretaria.test.tsx
// ============================================================================
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useSecretaria } from "@/features/secretaria/hooks/useSecretaria";
import { secretariaService } from "@/features/secretaria/services/secretariaService";

vi.mock("@/features/secretaria/services/secretariaService", () => ({
  secretariaService: {
    buscarAderidos: vi.fn(),
    adicionarAderidoIndividual: vi.fn(),
    atualizarAderidoSecretaria: vi.fn(),
  },
}));

const mockAderidos = [
  {
    id: "ADERIDO_001",
    email: "gabriel@teste.com",
    nome: "Gabriel",
    cargo: "admin",
    status_cadastro: "ativo",
    modalidade_adesao: "completo",
  },
];

describe("Hook useSecretaria", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve carregar aderidos e atualizar o estado", async () => {
    vi.mocked(secretariaService.buscarAderidos).mockResolvedValueOnce(
      mockAderidos as any,
    );

    const { result } = renderHook(() => useSecretaria());

    await act(async () => {
      await result.current.carregarAderidos();
    });

    expect(secretariaService.buscarAderidos).toHaveBeenCalledTimes(1);
    expect(result.current.aderidos).toEqual(mockAderidos);
    expect(result.current.loading).toBe(false);
  });

  it("Deve adicionar aderido e recarregar a lista", async () => {
    vi.mocked(
      secretariaService.adicionarAderidoIndividual,
    ).mockResolvedValueOnce({ idAderido: "ADERIDO_002" });
    vi.mocked(secretariaService.buscarAderidos).mockResolvedValueOnce(
      mockAderidos as any,
    );

    const { result } = renderHook(() => useSecretaria());

    await act(async () => {
      await result.current.adicionarAderidoIndividual({
        email: "novo@teste.com",
        nome: "Novo",
        curso: "",
        telefone: "",
        dataNascimento: "",
        cargo: "aderido",
        modalidade_adesao: "completo",
      });
    });

    expect(secretariaService.adicionarAderidoIndividual).toHaveBeenCalledTimes(
      1,
    );
    expect(secretariaService.buscarAderidos).toHaveBeenCalledTimes(1);
  });

  it("Deve atualizar aderido e recarregar a lista", async () => {
    vi.mocked(
      secretariaService.atualizarAderidoSecretaria,
    ).mockResolvedValueOnce({
      sucesso: true,
    });
    vi.mocked(secretariaService.buscarAderidos).mockResolvedValueOnce(
      mockAderidos as any,
    );

    const { result } = renderHook(() => useSecretaria());

    await act(async () => {
      await result.current.atualizarAderidoSecretaria("ADERIDO_001", {
        nome: "Gabriel Atualizado",
        email: "gabriel@teste.com",
        telefone: "",
        cpf: "",
        curso: "",
        genero: "",
        data_nascimento: "",
        cargo: "admin",
        modalidade_adesao: "completo",
        status_cadastro: "ativo",
      });
    });

    expect(secretariaService.atualizarAderidoSecretaria).toHaveBeenCalledWith(
      "ADERIDO_001",
      expect.objectContaining({
        nome: "Gabriel Atualizado",
      }),
    );
    expect(secretariaService.buscarAderidos).toHaveBeenCalledTimes(1);
  });
});
