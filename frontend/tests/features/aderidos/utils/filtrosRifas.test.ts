import { describe, expect, it } from "vitest";

import {
  calcularContadoresRifas,
  montarOpcoesFiltroRifas,
} from "@/features/aderidos/utils/filtrosRifas";
import type { RifaAderido } from "@/features/aderidos/types/painelAderido";

const rifas: RifaAderido[] = [
  { numero: "001", status: "disponivel" },
  { numero: "002", status: "pago" },
  { numero: "003", status: "pendente" },
  { numero: "004", status: "recusado" },
  { numero: "005", status: "pago" },
  { numero: "006", status: "reservado" },
];

describe("utils/filtrosRifas", () => {
  it("Deve calcular contadores por status", () => {
    expect(calcularContadoresRifas(rifas)).toEqual({
      todas: 6,
      disponivel: 1,
      reservado: 1,
      pendente: 1,
      pago: 2,
      recusado: 1,
    });
  });

  it("Deve ocultar Reservadas quando não houver rifas reservadas", () => {
    const contadores = calcularContadoresRifas(
      rifas.filter((rifa) => rifa.status !== "reservado"),
    );

    expect(
      montarOpcoesFiltroRifas(contadores, "todas").some(
        (opcao) => opcao.value === "reservado",
      ),
    ).toBe(false);
  });

  it("Deve manter Reservadas visível quando for o filtro atual", () => {
    const contadores = calcularContadoresRifas([]);

    expect(
      montarOpcoesFiltroRifas(contadores, "reservado").some(
        (opcao) => opcao.value === "reservado",
      ),
    ).toBe(true);
  });
});
