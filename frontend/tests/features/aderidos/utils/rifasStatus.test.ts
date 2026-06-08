// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/rifasStatus.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import {
  STATUS_RIFA_CONFIG,
  obterConfigStatusRifa,
} from "@/features/aderidos/utils/rifasStatus";

describe("Utils: rifasStatus", () => {
  it("Deve possuir configuração para os principais status de rifa", () => {
    expect(STATUS_RIFA_CONFIG.disponivel).toBeDefined();
    expect(STATUS_RIFA_CONFIG.pendente).toBeDefined();
    expect(STATUS_RIFA_CONFIG.pago).toBeDefined();
    expect(STATUS_RIFA_CONFIG.recusado).toBeDefined();
  });

  it("Deve retornar configuração de rifa disponível como selecionável", () => {
    const config = obterConfigStatusRifa("disponivel");

    expect(config.label).toMatch(/Dispon/i);
    expect(config.selecionavel).toBe(true);
    expect(config.abreDetalhes).toBe(false);
  });

  it("Deve retornar configuração de rifa paga abrindo detalhes", () => {
    const config = obterConfigStatusRifa("pago");

    expect(config.label).toMatch(/Paga/i);
    expect(config.selecionavel).toBe(false);
    expect(config.abreDetalhes).toBe(true);
  });

  it("Não deve permitir seleção de rifas pendentes ou recusadas", () => {
    expect(obterConfigStatusRifa("pendente").selecionavel).toBe(false);
    expect(obterConfigStatusRifa("recusado").selecionavel).toBe(false);
  });

  it("Deve manter rifas em análise na mesma família amarela do filtro", () => {
    const config = obterConfigStatusRifa("pendente");

    expect(config.bg).toBe("#FFF4D8");
    expect(config.color).toBe("#6B4A00");
    expect(config.border).toBe("#CBA64D");
  });

  it("Deve retornar uma configuração válida para status desconhecido", () => {
    const config = obterConfigStatusRifa("status_inexistente" as any);

    expect(config).toBeDefined();
    expect(typeof config.label).toBe("string");
    expect(typeof config.selecionavel).toBe("boolean");
    expect(typeof config.abreDetalhes).toBe("boolean");
  });
});
