// ============================================================================
// ARQUIVO: frontend/tests/secretaria/calcularResumoSecretaria.test.ts
// ============================================================================
import { describe, it, expect } from "vitest";

import { calcularResumoSecretaria } from "@/features/secretaria/utils/calcularResumoSecretaria";
import { AderidoSecretaria } from "@/features/secretaria/types/secretaria";

describe("calcularResumoSecretaria", () => {
  it("Deve calcular total, aderidos, meio-aderidos, pendentes e comissão", () => {
    const aderidos: AderidoSecretaria[] = [
      {
        id: "1",
        email: "admin@teste.com",
        cargo: "admin",
        status_cadastro: "ativo",
        modalidade_adesao: "completo",
      },
      {
        id: "2",
        email: "meio@teste.com",
        cargo: "aderido",
        status_cadastro: "pendente",
        modalidade_adesao: "meio",
      },
      {
        id: "3",
        email: "completo@teste.com",
        cargo: "aderido",
        status_cadastro: "ativo",
        modalidade_adesao: "completo",
      },
    ];

    const resumo = calcularResumoSecretaria(aderidos);

    expect(resumo).toEqual({
      total: 3,
      aderidos: 2,
      meioAderidos: 1,
      pendentes: 1,
      comissao: 1,
    });
  });

  it("Deve tratar registros sem modalidade como aderidos completos", () => {
    const aderidos: AderidoSecretaria[] = [
      {
        id: "1",
        email: "legado@teste.com",
        cargo: "aderido",
        status_cadastro: "ativo",
      },
    ];

    const resumo = calcularResumoSecretaria(aderidos);

    // Registros legados não devem sumir dos indicadores por falta de modalidade.
    expect(resumo.aderidos).toBe(1);
    expect(resumo.meioAderidos).toBe(0);
  });
});
