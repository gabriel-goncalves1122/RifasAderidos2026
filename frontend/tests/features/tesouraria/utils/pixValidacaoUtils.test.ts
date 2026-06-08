import { describe, expect, it } from "vitest";

import { PixTransacao } from "@/features/tesouraria/types/pixTransacoes";
import {
  calcularResumoValidacaoPix,
  obterAuditoriaValidacaoPix,
  obterStatusValidacaoPix,
  pixPagamentoConfirmadoBanco,
  pixTransacaoTemPendenciaVinculo,
} from "@/features/tesouraria/utils/pixValidacaoUtils";

function criarTransacao(parcial: Partial<PixTransacao>): PixTransacao {
  return {
    id: parcial.id || "tx_teste",
    referenceId: parcial.referenceId || "ref_teste",
    metodo: "PIX",
    statusPagamento: parcial.statusPagamento || "PAID",
    statusConciliacao: parcial.statusConciliacao || "conciliada",
    valorBruto: parcial.valorBruto ?? 10,
    valorPago: parcial.valorPago ?? 10,
    moeda: "BRL",
    dataCriacao: parcial.dataCriacao || "2026-10-01T10:00:00.000-03:00",
    ...parcial,
  };
}

describe("Utils: pixValidacaoUtils", () => {
  it("Deve separar confirmação bancária de validação manual", () => {
    const pago = criarTransacao({ statusPagamento: "PAID" });
    const aguardando = criarTransacao({
      statusPagamento: "WAITING",
      valorPago: 0,
    });

    expect(pixPagamentoConfirmadoBanco(pago)).toBe(true);
    expect(obterStatusValidacaoPix(pago)).toBe("pendente_validacao");
    expect(pixPagamentoConfirmadoBanco(aguardando)).toBe(false);
    expect(obterStatusValidacaoPix(aguardando)).toBe(
      "sem_confirmacao_bancaria",
    );
  });

  it("Deve considerar dados legados pagos como confirmados para validação", () => {
    const legadoPorRifas = criarTransacao({
      statusPagamento: "WAITING",
      valorPago: 0,
      rifas: [
        { numero: "010", status: "pago" },
        { numero: "011", status: "pago" },
      ],
    });
    const legadoPorValor = criarTransacao({
      statusPagamento: "WAITING",
      valorPago: 20,
      dataPagamento: "2026-10-01T10:10:00.000-03:00",
    });

    expect(pixPagamentoConfirmadoBanco(legadoPorRifas)).toBe(true);
    expect(obterStatusValidacaoPix(legadoPorRifas)).toBe(
      "pendente_validacao",
    );
    expect(pixPagamentoConfirmadoBanco(legadoPorValor)).toBe(true);
    expect(obterStatusValidacaoPix(legadoPorValor)).toBe(
      "pendente_validacao",
    );
  });

  it("Deve permitir aceitar ou negar somente Pix confirmado pelo banco", () => {
    const pago = criarTransacao({ statusPagamento: "PAID" });
    const aguardando = criarTransacao({
      statusPagamento: "WAITING",
      valorPago: 0,
    });
    const aceita = criarTransacao({ statusValidacao: "aceita" });

    expect(obterAuditoriaValidacaoPix(pago)).toMatchObject({
      pagamentoConfirmadoBanco: true,
      podeAceitar: true,
      podeNegar: true,
    });
    expect(obterAuditoriaValidacaoPix(aguardando)).toMatchObject({
      pagamentoConfirmadoBanco: false,
      podeAceitar: false,
      podeNegar: false,
    });
    expect(obterAuditoriaValidacaoPix(aceita)).toMatchObject({
      pagamentoConfirmadoBanco: true,
      podeAceitar: false,
      podeNegar: false,
    });
  });

  it("Deve calcular resumo da fila de auditoria Pix", () => {
    const vinculoCompleto = {
      vendaId: "venda_001",
      aderido: { id: "aderido_001", nome: "Ana Costa" },
      rifas: [{ numero: "010", status: "pago" }],
    };

    const resumo = calcularResumoValidacaoPix([
      criarTransacao({ id: "tx_pendente", ...vinculoCompleto }),
      criarTransacao({
        id: "tx_aceita",
        statusValidacao: "aceita",
        ...vinculoCompleto,
      }),
      criarTransacao({
        id: "tx_negada",
        statusValidacao: "negada",
        ...vinculoCompleto,
      }),
      criarTransacao({
        id: "tx_sem_confirmacao",
        statusPagamento: "WAITING",
        valorPago: 0,
        vendaId: "venda_002",
        aderido: { id: "aderido_002", nome: "Bruno Lima" },
        rifas: [{ numero: "020", status: "pendente" }],
      }),
    ]);

    expect(resumo).toEqual({
      quantidadeAguardandoValidacao: 1,
      quantidadeAceitas: 1,
      quantidadeNegadas: 1,
      quantidadeSemConfirmacaoBancaria: 1,
      quantidadeComRifas: 4,
      quantidadeSemVinculo: 0,
    });
  });

  it("Deve identificar transação sem vínculo operacional", () => {
    expect(
      pixTransacaoTemPendenciaVinculo(
        criarTransacao({
          vendaId: null,
          aderido: { nome: "Sem aderido vinculado" },
          rifas: [],
        }),
      ),
    ).toBe(true);
  });
});
