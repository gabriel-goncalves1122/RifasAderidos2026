import { describe, expect, it } from "vitest";

import {
  agruparComprasAuditaveis,
  calcularResumoAuditoria,
  criarCsvAuditoriaCompras,
  FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  filtrarComprasAuditaveis,
} from "@/features/tesouraria/utils/auditoriaComprasUtils";
import { TransacaoAuditoriaComprasBase } from "@/features/tesouraria/types/auditoriaCompras";

const transacoes: TransacaoAuditoriaComprasBase[] = [
  {
    numero_rifa: "001",
    status: "pago",
    vendedor_nome: "Ana Vendedora",
    vendedor_cpf: "11122233344",
    comprador_id: "comprador_maria",
    comprador_nome: "Maria Souza",
    comprador_email: "maria@teste.com",
    comprador_telefone: "35999990000",
    data_reserva: "2026-05-01T10:00:00.000-03:00",
    comprovante_url: "https://storage.mock/comprovante-maria.png",
    valor: 10,
  },
  {
    numero_rifa: "002",
    status: "pago",
    vendedor_nome: "Ana Vendedora",
    vendedor_cpf: "11122233344",
    comprador_id: "comprador_maria",
    comprador_nome: "Maria Souza",
    comprador_email: "maria@teste.com",
    comprador_telefone: "35999990000",
    data_reserva: "2026-05-01T10:00:00.000-03:00",
    comprovante_url: "https://storage.mock/comprovante-maria.png",
    valor: 10,
  },
  {
    numero_rifa: "003",
    status: "pendente",
    vendedor_nome: "Bruno Vendedor",
    vendedor_cpf: "55566677788",
    comprador_id: "comprador_joao",
    comprador_nome: "João Lima",
    comprador_email: "joao@teste.com",
    comprador_telefone: "35988887777",
    data_reserva: "2026-05-10T10:00:00.000-03:00",
    comprovante_url: null,
    valor: 10,
  },
];

describe("Utils: histórico de auditoria", () => {
  it("Deve agrupar compras por comprador_id preservando bilhetes", () => {
    const compras = agruparComprasAuditaveis(transacoes);
    const compraMaria = compras.find(
      (compra) => compra.comprador_id === "comprador_maria",
    );

    expect(compras).toHaveLength(2);
    expect(compraMaria?.bilhetes).toEqual(["001", "002"]);
    expect(compraMaria?.valor_total).toBe(20);
  });

  it("Deve filtrar por busca, status e comprovante", () => {
    const compras = agruparComprasAuditaveis(transacoes);

    expect(
      filtrarComprasAuditaveis(compras, {
        ...FILTROS_AUDITORIA_COMPRAS_VAZIOS,
        termoBusca: "003",
      }),
    ).toHaveLength(1);

    expect(
      filtrarComprasAuditaveis(compras, {
        ...FILTROS_AUDITORIA_COMPRAS_VAZIOS,
        status: "pendente",
      }),
    ).toHaveLength(1);

    expect(
      filtrarComprasAuditaveis(compras, {
        ...FILTROS_AUDITORIA_COMPRAS_VAZIOS,
        comprovante: "com",
      }),
    ).toHaveLength(1);
  });

  it("Deve calcular resumo e gerar CSV auditável", () => {
    const compras = agruparComprasAuditaveis(transacoes);
    const resumo = calcularResumoAuditoria(compras);
    const csv = criarCsvAuditoriaCompras(compras);

    expect(resumo.totalCompras).toBe(2);
    expect(resumo.totalRifas).toBe(3);
    expect(resumo.valorTotal).toBe(30);
    expect(csv).toContain("Comprador");
    expect(csv).toContain("Maria Souza");
  });
});
