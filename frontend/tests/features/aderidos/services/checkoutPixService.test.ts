// ============================================================================
// ARQUIVO: frontend/tests/features/aderidos/services/checkoutPixService.test.ts
// ============================================================================
import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkoutPixService } from "@/features/aderidos/services/checkoutPixService";
import { fetchAPI } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Service: checkoutPixService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve criar pagamento via Pix chamando o backend do sistema", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      status: "aguardando_pagamento",
      qrCodeImagemUrl: "https://example.com/qr.png",
      copiaECola: "000201PIXTESTE",
      expiraEm: "2026-06-07T18:00:00.000-03:00",
    });

    const resultado = await checkoutPixService.criarCobrancaPix({
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
      numerosRifas: ["001", "002"],
    });

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/checkout/pix", "POST", {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
      numerosRifas: ["001", "002"],
    });
    expect(resultado).toEqual({
      id: "pix_001",
      status: "aguardando_pagamento",
      qrCodeImagemUrl: "https://example.com/qr.png",
      qrCodeBase64: null,
      copiaECola: "000201PIXTESTE",
      expiraEm: "2026-06-07T18:00:00.000-03:00",
    });
  });

  it("Deve enviar e-mail vazio quando não houver e-mail informado", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      copiaECola: "000201PIXTESTE",
    });

    await checkoutPixService.criarCobrancaPix({
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      numerosRifas: ["001"],
    });

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/checkout/pix", "POST", {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "",
      numerosRifas: ["001"],
    });
  });

  it("Deve rejeitar resposta Pix incompleta", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
    });

    await expect(
      checkoutPixService.criarCobrancaPix({
        nome: "Ana Beatriz",
        telefone: "(35) 99999-8888",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("Pagamento via Pix incompleto.");
  });
});
