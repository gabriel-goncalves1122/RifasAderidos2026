// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/services/rifaService.test.ts
// ============================================================================
import { describe, it, expect, vi, beforeEach } from "vitest";

import { fetchAPI } from "@/shared/services/api";
import { rifaService } from "@/features/rifas/services/rifasService";
import { rifasStorageService } from "@/features/rifas/services/rifasStorageService";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

vi.mock("@/features/rifas/services/rifasStorageService", () => ({
  rifasStorageService: {
    uploadComprovante: vi.fn(),
    uploadComprovanteAtrasado: vi.fn(),
  },
}));

describe("Service: rifasService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar minhas rifas e retornar os bilhetes", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      bilhetes: [{ numero: "001" }],
    });

    const resultado = await rifaService.buscarMinhasRifas();

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/minhas-rifas");
    expect(resultado).toEqual([{ numero: "001" }]);
  });

  it("Deve finalizar venda fazendo upload e enviando a venda para API", async () => {
    vi.mocked(rifasStorageService.uploadComprovante).mockResolvedValueOnce(
      "https://fake-url.com/comprovante.pdf",
    );

    vi.mocked(fetchAPI).mockResolvedValueOnce({ sucesso: true });

    const arquivo = new File(["teste"], "comprovante.pdf", {
      type: "application/pdf",
    });

    const resultado = await rifaService.finalizarVenda({
      nome: "Gabriel",
      telefone: "(35) 99999-9999",
      email: "gabriel@teste.com",
      numerosRifas: ["001", "002"],
      comprovante: arquivo,
    });

    expect(resultado).toBe(true);

    expect(rifasStorageService.uploadComprovante).toHaveBeenCalledWith(
      expect.objectContaining({
        arquivo,
        pasta: "comprovantes",
        nomeBase: "venda",
      }),
    );

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/vender", "POST", {
      nome: "Gabriel",
      telefone: "(35) 99999-9999",
      email: "gabriel@teste.com",
      numerosRifas: ["001", "002"],
      comprovanteUrl: "https://fake-url.com/comprovante.pdf",
    });
  });

  it("Deve corrigir rifas recusadas fazendo upload e enviando correção para API", async () => {
    vi.mocked(rifasStorageService.uploadComprovante).mockResolvedValueOnce(
      "https://fake-url.com/correcao.pdf",
    );

    vi.mocked(fetchAPI).mockResolvedValueOnce({ sucesso: true });

    const arquivo = new File(["teste"], "correcao.pdf", {
      type: "application/pdf",
    });

    const resultado = await rifaService.corrigirRifasRecusadas({
      nome: "Ana",
      telefone: "(11) 99999-9999",
      email: "ana@teste.com",
      numerosRifas: ["015"],
      comprovante: arquivo,
    });

    expect(resultado).toBe(true);

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/corrigir", "POST", {
      nome: "Ana",
      telefone: "(11) 99999-9999",
      email: "ana@teste.com",
      numerosRifas: ["015"],
      comprovanteUrl: "https://fake-url.com/correcao.pdf",
    });
  });

  it("Deve anexar comprovante atrasado em uma rifa específica", async () => {
    vi.mocked(
      rifasStorageService.uploadComprovanteAtrasado,
    ).mockResolvedValueOnce("https://fake-url.com/anexo.pdf");

    vi.mocked(fetchAPI).mockResolvedValueOnce({ sucesso: true });

    const arquivo = new File(["teste"], "anexo.pdf", {
      type: "application/pdf",
    });

    const resultado = await rifaService.anexarComprovante("RIFA_001", arquivo);

    expect(resultado).toBe(true);

    expect(fetchAPI).toHaveBeenCalledWith(
      "/rifas/RIFA_001/comprovante",
      "PUT",
      {
        comprovante_url: "https://fake-url.com/anexo.pdf",
      },
    );
  });
});
