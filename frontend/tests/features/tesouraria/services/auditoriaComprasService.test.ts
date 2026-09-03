import { beforeEach, describe, expect, it, vi } from "vitest";

import { auditoriaComprasService } from "@/features/tesouraria/services/auditoriaComprasService";
import { fetchAPI } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Service: auditoriaComprasService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar histórico no endpoint legado atual", async () => {
    const historico = [{ numero_rifa: "001", status: "pago" }];
    vi.mocked(fetchAPI).mockResolvedValueOnce({ historico });

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(fetchAPI).toHaveBeenCalledWith("/tesouraria/historico");
    expect(resultado).toEqual(historico);
  });

  it("Deve aceitar lista direta no payload", async () => {
    const historico = [{ numero_rifa: "002", status: "pendente" }];
    vi.mocked(fetchAPI).mockResolvedValueOnce(historico);

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(resultado).toEqual(historico);
  });

  it("Deve aceitar objeto indexado no payload", async () => {
    const item = { numero_rifa: "003", status: "recusado" };
    vi.mocked(fetchAPI).mockResolvedValueOnce({ item });

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(resultado).toEqual([item]);
  });

  it("Deve retornar lista vazia quando o payload vier ausente", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce(null);

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(resultado).toEqual([]);
  });

  it("Deve atualizar dados do comprador pelo endpoint canônico de tesouraria", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ sucesso: true });

    await auditoriaComprasService.atualizarComprador("comprador_123", {
      nome: "Maria Atualizada",
      email: "maria@teste.com",
      telefone: "35999990000",
    });

    expect(fetchAPI).toHaveBeenCalledWith(
      "/tesouraria/historico/compras/comprador_123",
      "PATCH",
      {
        nome: "Maria Atualizada",
        email: "maria@teste.com",
        telefone: "35999990000",
      },
    );
  });

  it("Deve reenviar e-mail de comprovante pelo endpoint canônico de tesouraria", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      sucesso: true,
      mensagem: "E-mail de comprovante reenviado.",
      envio: {
        comprador_id: "comprador_123",
        email: "maria@teste.com",
        rifas: ["001"],
        status: "aprovado",
      },
    });

    const resultado =
      await auditoriaComprasService.reenviarEmailComprovante("comprador_123");

    expect(fetchAPI).toHaveBeenCalledWith(
      "/tesouraria/historico/compras/comprador_123/reenviar-email-comprovante",
      "POST",
    );
    expect(resultado.mensagem).toBe("E-mail de comprovante reenviado.");
  });
});
