import { describe, expect, it } from "vitest";

import {
  calcularResumoAuditoria,
  criarCsvAuditoriaCompras,
  FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  filtrarComprasAuditaveis,
} from "@/features/tesouraria/utils/auditoriaComprasUtils";
import { TransacaoTesouraria } from "@/features/tesouraria/types/auditoriaCompras";

const compras: TransacaoTesouraria[] = [
  {
    id: "comprador_maria",
    dataReserva: "2026-05-01T10:00:00.000-03:00",
    dataPagamento: "2026-05-01T10:05:00.000-03:00",
    vendedorId: "vend_1",
    vendedorNome: "Ana Vendedora",
    vendedorCpf: "11122233344",
    compradorId: "comprador_maria",
    compradorNome: "Maria Souza",
    compradorEmail: "maria@teste.com",
    compradorTelefone: "35999990000",
    status: "pago",
    comprovanteUrl: "https://storage.mock/comprovante-maria.png",
    bilhetes: ["001", "002"],
    valorTotal: 20,
  },
  {
    id: "comprador_joao",
    dataReserva: "2026-05-10T10:00:00.000-03:00",
    dataPagamento: null,
    vendedorId: "vend_2",
    vendedorNome: "Bruno Vendedor",
    vendedorCpf: "55566677788",
    compradorId: "comprador_joao",
    compradorNome: "João Lima",
    compradorEmail: "joao@teste.com",
    compradorTelefone: "35988887777",
    status: "pendente",
    comprovanteUrl: null,
    bilhetes: ["003"],
    valorTotal: 10,
  },
];

describe("Utils: histórico de auditoria", () => {
  it("Deve filtrar por busca, status e comprovante", () => {
    expect(
      filtrarComprasAuditaveis(compras, {
        ...FILTROS_AUDITORIA_COMPRAS_VAZIOS,
        busca: "003",
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
    const resumo = calcularResumoAuditoria(compras);
    const csv = criarCsvAuditoriaCompras(compras);

    expect(resumo.totalCompras).toBe(2);
    expect(resumo.totalRifas).toBe(3);
    expect(resumo.valorTotal).toBe(30);
    expect(csv).toContain("Comprador");
    expect(csv).toContain("Maria Souza");
  });
});
