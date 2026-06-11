// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/services/rifasService.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mocks = {
  buscarPorAderido: jest.fn<any>(),
  processarVenda: jest.fn<any>(),
  corrigirRifasRecusadas: jest.fn<any>(),
  corrigirDadosRifasRecusadas: jest.fn<any>(),
  criarCobrancaPix: jest.fn<any>(),
  consultarCobrancaPix: jest.fn<any>(),
  processarWebhook: jest.fn<any>(),
  obterRelatorioTesouraria: jest.fn<any>(),
  obterHistoricoDetalhado: jest.fn<any>(),
};

jest.mock("../../../src/modules/rifas/services/aderidoRifasService", () => ({
  AderidoRifasService: {
    buscarPorAderido: mocks.buscarPorAderido,
  },
}));

jest.mock("../../../src/modules/rifas/services/vendaRifasService", () => ({
  VendaRifasService: {
    processarVenda: mocks.processarVenda,
  },
}));

jest.mock("../../../src/modules/rifas/services/correcaoRifasService", () => ({
  CorrecaoRifasService: {
    corrigirRifasRecusadas: mocks.corrigirRifasRecusadas,
  },
}));

jest.mock(
  "../../../src/modules/rifas/services/correcaoDadosRifasService",
  () => ({
    CorrecaoDadosRifasService: {
      corrigirDadosRifasRecusadas: mocks.corrigirDadosRifasRecusadas,
    },
  }),
);

jest.mock("../../../src/modules/rifas/services/checkoutPixService", () => ({
  CheckoutPixService: {
    criarCobrancaPix: mocks.criarCobrancaPix,
    consultarCobrancaPix: mocks.consultarCobrancaPix,
  },
}));

jest.mock(
  "../../../src/modules/rifas/services/checkoutPixWebhookService",
  () => ({
    CheckoutPixWebhookService: {
      processarWebhook: mocks.processarWebhook,
    },
  }),
);

jest.mock("../../../src/modules/rifas/services/relatorioRifasService", () => ({
  RelatorioRifasService: {
    obterRelatorioTesouraria: mocks.obterRelatorioTesouraria,
    obterHistoricoDetalhado: mocks.obterHistoricoDetalhado,
  },
}));

import { RifasService } from "../../../src/modules/rifas/rifasService";

describe("Fachada: RifasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve delegar buscarPorAderido para AderidoRifasService", async () => {
    mocks.buscarPorAderido.mockResolvedValueOnce([{ numero: "001" }]);

    const resultado = await RifasService.buscarPorAderido("aderido@email.com");

    expect(mocks.buscarPorAderido).toHaveBeenCalledWith("aderido@email.com");
    expect(resultado).toEqual([{ numero: "001" }]);
  });

  it("Deve delegar processarVenda para VendaRifasService", async () => {
    const dadosVenda = {
      nome: "Comprador",
      telefone: "11999999999",
      numerosRifas: ["001"],
      comprovanteUrl: "https://storage.mock/comprovante.png",
    };

    mocks.processarVenda.mockResolvedValueOnce(undefined);

    await RifasService.processarVenda(
      "UID_001",
      "aderido@email.com",
      dadosVenda,
    );

    expect(mocks.processarVenda).toHaveBeenCalledWith(
      "UID_001",
      "aderido@email.com",
      dadosVenda,
    );
  });

  it("Deve delegar corrigirRifasRecusadas para CorrecaoRifasService", async () => {
    const dadosCorrecao = {
      nome: "Comprador",
      telefone: "11999999999",
      email: "comprador@email.com",
      comprovanteUrl: "https://storage.mock/comprovante.png",
    };

    mocks.corrigirRifasRecusadas.mockResolvedValueOnce(true);

    const resultado = await RifasService.corrigirRifasRecusadas(
      "aderido@email.com",
      ["010"],
      dadosCorrecao,
    );

    expect(mocks.corrigirRifasRecusadas).toHaveBeenCalledWith(
      "aderido@email.com",
      ["010"],
      dadosCorrecao,
    );

    expect(resultado).toBe(true);
  });

  it("Deve delegar corrigirDadosRifasRecusadas para CorrecaoDadosRifasService", async () => {
    const dadosCorrecao = {
      nome: "Comprador",
      telefone: "11999999999",
      email: "comprador@email.com",
    };

    mocks.corrigirDadosRifasRecusadas.mockResolvedValueOnce(true);

    const resultado = await RifasService.corrigirDadosRifasRecusadas(
      "aderido@email.com",
      ["010"],
      dadosCorrecao,
    );

    expect(mocks.corrigirDadosRifasRecusadas).toHaveBeenCalledWith(
      "aderido@email.com",
      ["010"],
      dadosCorrecao,
    );
    expect(resultado).toBe(true);
  });

  it("Deve delegar criarCheckoutPix para CheckoutPixService", async () => {
    const payload = {
      nome: "Comprador",
      telefone: "11999999999",
      numerosRifas: ["001"],
    };
    const cobranca = { id: "ORDE_001", copiaECola: "000201PIX" };

    mocks.criarCobrancaPix.mockResolvedValueOnce(cobranca);

    const resultado = await RifasService.criarCheckoutPix(
      "UID_001",
      "aderido@email.com",
      payload,
    );

    expect(mocks.criarCobrancaPix).toHaveBeenCalledWith(
      "UID_001",
      "aderido@email.com",
      payload,
    );
    expect(resultado).toBe(cobranca);
  });

  it("Deve delegar consultarCheckoutPix para CheckoutPixService", async () => {
    const cobranca = { id: "ORDE_001", status: "pago" };

    mocks.consultarCobrancaPix.mockResolvedValueOnce(cobranca);

    const resultado = await RifasService.consultarCheckoutPix(
      "aderido@email.com",
      "ORDE_001",
    );

    expect(mocks.consultarCobrancaPix).toHaveBeenCalledWith(
      "aderido@email.com",
      "ORDE_001",
    );
    expect(resultado).toBe(cobranca);
  });

  it("Deve delegar processarWebhookCheckoutPix para CheckoutPixWebhookService", async () => {
    const params = {
      payload: { id: "ORDE_001" },
      rawBody: '{"id":"ORDE_001"}',
      assinatura: "assinatura",
    };

    mocks.processarWebhook.mockResolvedValueOnce({ sucesso: true });

    const resultado = await RifasService.processarWebhookCheckoutPix(params);

    expect(mocks.processarWebhook).toHaveBeenCalledWith(params);
    expect(resultado).toEqual({ sucesso: true });
  });

  it("Deve delegar obterRelatorioTesouraria para RelatorioRifasService", async () => {
    const relatorio = {
      resumoGeral: {
        totalArrecadado: 100,
      },
      aderidos: [],
    };

    mocks.obterRelatorioTesouraria.mockResolvedValueOnce(relatorio);

    const resultado = await RifasService.obterRelatorioTesouraria();

    expect(mocks.obterRelatorioTesouraria).toHaveBeenCalledTimes(1);
    expect(resultado).toBe(relatorio);
  });

  it("Deve delegar obterHistoricoDetalhado para RelatorioRifasService", async () => {
    const historico = [{ status: "pago" }];

    mocks.obterHistoricoDetalhado.mockResolvedValueOnce(historico);

    const resultado = await RifasService.obterHistoricoDetalhado();

    expect(mocks.obterHistoricoDetalhado).toHaveBeenCalledTimes(1);
    expect(resultado).toBe(historico);
  });
});
