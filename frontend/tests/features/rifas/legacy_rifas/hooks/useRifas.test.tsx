// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/hooks/useRifas.test.tsx
// ============================================================================
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  buscarMinhasRifas: vi.fn(),
  finalizarVenda: vi.fn(),
  corrigirRifasRecusadas: vi.fn(),
  anexarComprovante: vi.fn(),
}));

vi.mock("@/features/rifas/services/rifasService", () => ({
  rifaService: {
    buscarMinhasRifas: mocks.buscarMinhasRifas,
    finalizarVenda: mocks.finalizarVenda,
    corrigirRifasRecusadas: mocks.corrigirRifasRecusadas,
    anexarComprovante: mocks.anexarComprovante,
  },
}));

import { useRifas } from "@/features/rifas/hooks/useRifas";

function criarArquivoMock(nome = "comprovante.png", tipo = "image/png") {
  return new File(["comprovante"], nome, {
    type: tipo,
  });
}

describe("Hook: useRifas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.buscarMinhasRifas.mockResolvedValue([
      {
        numero: "001",
        status: "disponivel",
      },
      {
        numero: "002",
        status: "pago",
      },
    ]);

    mocks.finalizarVenda.mockResolvedValue(true);
    mocks.corrigirRifasRecusadas.mockResolvedValue(true);
    mocks.anexarComprovante.mockResolvedValue(true);
  });

  it("Deve buscar minhas rifas com sucesso", async () => {
    const { result } = renderHook(() => useRifas());

    let rifas: Array<{ numero: string; status: string }> = [];

    await act(async () => {
      rifas = await result.current.buscarMinhasRifas();
    });

    expect(rifas).toHaveLength(2);
    expect(rifas[0].numero).toBe("001");
  });

  it("Deve corrigir rifas recusadas chamando o service", async () => {
    const { result } = renderHook(() => useRifas());

    const arquivo = criarArquivoMock("comprovante_novo.pdf", "application/pdf");

    const sucesso = await act(async () =>
      result.current.corrigirRifasRecusadas(["003", "004"], arquivo, {
        nome: "Ana Costa",
        telefone: "(35) 99999-9999",
        email: "ana@email.com",
      }),
    );

    expect(sucesso).toBe(true);

    expect(mocks.corrigirRifasRecusadas).toHaveBeenCalledWith({
      numerosRifas: ["003", "004"],
      comprovante: arquivo,
      nome: "Ana Costa",
      telefone: "(35) 99999-9999",
      email: "ana@email.com",
    });
  });

  it("Deve retornar false quando a correção falhar", async () => {
    mocks.corrigirRifasRecusadas.mockRejectedValueOnce(
      new Error("Falha no upload"),
    );

    const { result } = renderHook(() => useRifas());

    const arquivo = criarArquivoMock();

    const sucesso = await act(async () =>
      result.current.corrigirRifasRecusadas(["003"], arquivo, {
        nome: "Ana Costa",
        telefone: "(35) 99999-9999",
        email: "ana@email.com",
      }),
    );

    expect(sucesso).toBe(false);
    expect(mocks.corrigirRifasRecusadas).toHaveBeenCalledTimes(1);
  });
});
