import { describe, expect, it } from "vitest";

import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";
import { PixTransacao } from "@/features/tesouraria/types/pixTransacoes";
import {
  calcularResumoPixTransacoes,
  filtrarPixTransacoes,
  formatarMoedaPix,
  obterLabelStatusConciliacao,
  obterLabelStatusPagamento,
} from "@/features/tesouraria/utils/pixTransacoesUtils";

function criarTransacao(
  parcial: Partial<PixTransacao>,
): PixTransacao {
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

describe("Utils: pixTransacoesUtils", () => {
  it("Deve formatar moeda brasileira com fallback seguro", () => {
    expect(formatarMoedaPix(50)).toMatch(/R\$\s*50,00/);
    expect(formatarMoedaPix(undefined)).toMatch(/R\$\s*0,00/);
  });

  it("Deve traduzir status Pix", () => {
    expect(obterLabelStatusPagamento("PAID")).toBe("Pago");
    expect(obterLabelStatusPagamento("CANCELED")).toBe("Cancelado");
  });

  it("Deve traduzir status de conciliação", () => {
    expect(obterLabelStatusConciliacao("conciliada")).toBe("Conciliada");
    expect(obterLabelStatusConciliacao("nao_identificada")).toBe(
      "Não identificada",
    );
  });

  it("Deve calcular resumo financeiro a partir das transações mockadas do banco", () => {
    const resumo = calcularResumoPixTransacoes(pixTransacoesMock);

    expect(resumo.totalRecebido).toBe(50);
    expect(resumo.quantidadePagas).toBe(2);
    expect(resumo.quantidadeNaoIdentificadas).toBe(1);
    expect(resumo.quantidadeAguardandoValidacao).toBe(2);
    expect(resumo.quantidadeSemConfirmacaoBancaria).toBe(1);
    expect(resumo.quantidadeComRifas).toBe(2);
    expect(resumo.quantidadeSemVinculo).toBe(2);
    expect(resumo.ticketMedio).toBe(25);
  });

  it("Deve filtrar por CPF, documento do comprador, aderido e rifas", () => {
    const transacoes = [
      criarTransacao({
        id: "tx_001",
        referenceId: "pedido_ana",
        compradorNome: "Cliente Ana",
        compradorDocumento: "12345678900",
        aderido: { nome: "Ana Costa", cpf: "11122233344" },
        rifas: [{ numero: "010" }],
      }),
      criarTransacao({
        id: "tx_002",
        referenceId: "pedido_bruno",
        compradorNome: "Cliente Bruno",
        compradorDocumento: "98765432100",
        aderido: { nome: "Bruno Lima", cpf: "55566677788" },
        rifas: [{ numero: "099" }],
      }),
    ];

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "todas",
        busca: "111.222.333-44",
      }),
    ).toEqual([transacoes[0]]);

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "todas",
        busca: "98765432100",
      }),
    ).toEqual([transacoes[1]]);

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "todas",
        busca: "bruno",
      }),
    ).toEqual([transacoes[1]]);

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "todas",
        busca: "099",
      }),
    ).toEqual([transacoes[1]]);
  });

  it("Não deve usar reference ID como campo de busca da auditoria Pix", () => {
    const transacoes = [
      criarTransacao({
        id: "tx_001",
        referenceId: "pedido_ana",
        compradorNome: "Cliente Ana",
      }),
    ];

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "todas",
        busca: "pedido_ana",
      }),
    ).toEqual([]);
  });

  it("Deve filtrar a fila de auditoria Pix por critérios operacionais", () => {
    const transacoes = [
      criarTransacao({
        id: "tx_para_validar",
        vendaId: "venda_001",
        aderido: { id: "aderido_001", nome: "Ana Costa" },
        rifas: [{ numero: "010", status: "pago" }],
      }),
      criarTransacao({
        id: "tx_sem_vinculo",
        vendaId: null,
        aderido: { nome: "Sem aderido vinculado" },
        rifas: [],
      }),
      criarTransacao({
        id: "tx_pendente_banco",
        statusPagamento: "WAITING",
        valorPago: 0,
        dataPagamento: null,
        vendaId: "venda_002",
        aderido: { id: "aderido_002", nome: "Bruno Lima" },
        rifas: [{ numero: "020", status: "pendente" }],
      }),
      criarTransacao({
        id: "tx_aceita",
        statusValidacao: "aceita",
        vendaId: "venda_003",
        aderido: { id: "aderido_003", nome: "Carla Dias" },
        rifas: [{ numero: "030", status: "pago" }],
      }),
    ];

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "para_validar",
        busca: "",
      }),
    ).toEqual([transacoes[0], transacoes[1]]);

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "com_rifas",
        busca: "",
      }),
    ).toEqual([transacoes[0], transacoes[2], transacoes[3]]);

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "sem_vinculo",
        busca: "",
      }),
    ).toEqual([transacoes[1]]);

    expect(
      filtrarPixTransacoes(transacoes, {
        status: "pendentes_banco",
        busca: "",
      }),
    ).toEqual([transacoes[2]]);
  });
});
