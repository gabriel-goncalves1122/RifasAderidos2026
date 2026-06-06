import { describe, expect, it } from "vitest";

import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";
import {
  formatarValorEixoPix,
  montarDadosTemporaisPix,
} from "@/features/tesouraria/utils/pixVisaoGeralUtils";

describe("Utils: pixVisaoGeralUtils", () => {
  it("Deve montar série temporal agrupada e ordenada por dia", () => {
    const resultado = montarDadosTemporaisPix([
      ...pixTransacoesMock,
      {
        ...pixTransacoesMock[0],
        id: "pix-pendente-teste",
        statusPagamento: "WAITING",
        valorBruto: 45,
        valorPago: 0,
      },
    ]);

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.map((item) => item.dataOrdenacao)).toEqual(
      [...resultado].map((item) => item.dataOrdenacao).sort((a, b) => a - b),
    );
    expect(resultado.some((item) => item.recebido > 0)).toBe(true);
    expect(resultado.some((item) => item.pendente > 0)).toBe(true);
  });

  it("Deve ignorar transações sem data válida", () => {
    const resultado = montarDadosTemporaisPix([
      {
        ...pixTransacoesMock[0],
        id: "sem-data-valida",
        dataCriacao: "data-invalida",
        dataPagamento: null,
      },
    ]);

    expect(resultado).toEqual([]);
  });

  it("Deve formatar valores do eixo em reais e milhares", () => {
    expect(formatarValorEixoPix(900)).toBe("R$ 900");
    expect(formatarValorEixoPix(2400)).toBe("R$ 2 mil");
  });
});
