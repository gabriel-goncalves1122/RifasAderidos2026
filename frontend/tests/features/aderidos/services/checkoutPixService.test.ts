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
      documento: "123.456.789-09",
      numerosRifas: ["001", "002"],
    });

    // Telefone e sanitizado (so digitos) antes de enviar ao backend
    expect(fetchAPI).toHaveBeenCalledWith("/tesouraria/checkout/pix", "POST", expect.objectContaining({
      nome: "Ana Beatriz",
      telefone: "35999998888",
      email: "ana@email.com",
      documento: "12345678909",
      numerosRifas: ["001", "002"],
    }));
    expect(resultado).toEqual({
      id: "pix_001",
      status: "aguardando_pagamento",
      qrCodeImagemUrl: "https://example.com/qr.png",
      qrCodeBase64: null,
      copiaECola: "000201PIXTESTE",
      expiraEm: "2026-06-07T18:00:00.000-03:00",
    });
  });

  it("Deve enviar e-mail vazio quando nao houver e-mail informado", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      copiaECola: "000201PIXTESTE",
    });

    await checkoutPixService.criarCobrancaPix({
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      numerosRifas: ["001"],
    });

    expect(fetchAPI).toHaveBeenCalledWith("/tesouraria/checkout/pix", "POST", expect.objectContaining({
      nome: "Ana Beatriz",
      telefone: "35999998888",
      email: "",
      documento: "",
      numerosRifas: ["001"],
    }));
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

  it("Deve rejeitar nome vazio apos sanitizacao", async () => {
    await expect(
      checkoutPixService.criarCobrancaPix({
        nome: "   ",
        telefone: "35999998888",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("Nome do comprador e obrigatorio.");
  });

  it("Deve rejeitar telefone vazio apos sanitizacao", async () => {
    await expect(
      checkoutPixService.criarCobrancaPix({
        nome: "Ana",
        telefone: "(xx) ",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("Telefone do comprador e obrigatorio.");
  });

  it("Deve rejeitar lista de rifas vazia", async () => {
    await expect(
      checkoutPixService.criarCobrancaPix({
        nome: "Ana",
        telefone: "35999998888",
        numerosRifas: [],
      }),
    ).rejects.toThrow("Selecione ao menos uma rifa para gerar o pagamento.");
  });

  it("Nao deve permitir requisicoes simultaneas (mutex)", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      copiaECola: "000201PIXTESTE",
    });

    // Inicia primeira requisicao (mutex trava)
    const promise1 = checkoutPixService.criarCobrancaPix({
      nome: "Ana",
      telefone: "35999998888",
      numerosRifas: ["001"],
    });

    // Segunda chamada deve rejeitar imediatamente
    await expect(
      checkoutPixService.criarCobrancaPix({
        nome: "Joao",
        telefone: "11999998888",
        numerosRifas: ["002"],
      }),
    ).rejects.toThrow("Ja existe uma cobranca sendo gerada.");

    // Aguarda primeira finalizar
    await promise1;

    // fetchAPI deve ter sido chamado apenas uma vez
    expect(fetchAPI).toHaveBeenCalledTimes(1);
  });

  it("Deve liberar mutex apos erro na API", async () => {
    vi.mocked(fetchAPI).mockRejectedValueOnce(new Error("Erro HTTP 500"));

    await expect(
      checkoutPixService.criarCobrancaPix({
        nome: "Ana",
        telefone: "35999998888",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("Erro HTTP 500");

    // Mutex foi liberado no finally: proxima chamada deve funcionar
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_002",
      copiaECola: "000201OUTRO",
    });

    const resultado = await checkoutPixService.criarCobrancaPix({
      nome: "Joao",
      telefone: "11999998888",
      numerosRifas: ["002"],
    });

    expect(resultado.id).toBe("pix_002");
    expect(fetchAPI).toHaveBeenCalledTimes(2);
  });

  it("Deve sanitizar telefone com formatacao variada", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      copiaECola: "000201PIXTESTE",
    });

    await checkoutPixService.criarCobrancaPix({
      nome: "Carlos",
      telefone: "+55 (35) 9 9999-8888",
      numerosRifas: ["001"],
    });

    expect(fetchAPI).toHaveBeenCalledWith("/tesouraria/checkout/pix", "POST", expect.objectContaining({
      nome: "Carlos",
      telefone: "5535999998888",
      email: "",
      documento: "",
      numerosRifas: ["001"],
    }));
  });

  it("Deve limitar tamanho do nome e telefone", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      copiaECola: "000201PIXTESTE",
    });

    const nomeGrande = "A".repeat(200);
    const telefoneGrande = "1".repeat(50);

    await checkoutPixService.criarCobrancaPix({
      nome: nomeGrande,
      telefone: telefoneGrande,
      numerosRifas: ["001"],
    });

    const chamada = vi.mocked(fetchAPI).mock.calls[0][2] as any;
    expect(chamada.nome.length).toBe(120);
    expect(chamada.telefone.length).toBe(20);
  });

  it("Deve sanitizar CPF opcional antes de enviar ao backend", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      id: "pix_001",
      copiaECola: "000201PIXTESTE",
    });

    await checkoutPixService.criarCobrancaPix({
      nome: "Ana",
      telefone: "35999998888",
      email: " ANA@EMAIL.COM ",
      documento: "123.456.789-09",
      numerosRifas: ["001"],
    });

    expect(fetchAPI).toHaveBeenCalledWith("/tesouraria/checkout/pix", "POST", expect.objectContaining({
      nome: "Ana",
      telefone: "35999998888",
      email: "ANA@EMAIL.COM",
      documento: "12345678909",
      numerosRifas: ["001"],
    }));
  });
});
