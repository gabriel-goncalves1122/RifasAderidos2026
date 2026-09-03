// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/FiltrosRifas.test.tsx
// ============================================================================
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FiltrosRifas } from "@/features/aderidos/components/FiltrosRifas";
import { painelAderidoStyles } from "@/features/aderidos/styles/painelAderidoStyles";
import type { ContadoresRifas } from "@/features/aderidos/utils/filtrosRifas";

const contadores: ContadoresRifas = {
  todas: 5,
  disponivel: 1,
  reservado: 0,
  pendente: 1,
  pago: 2,
  recusado: 1,
};

describe("Componente <FiltrosRifas />", () => {
  it("Deve renderizar todos os filtros principais sem contadores visíveis", () => {
    render(
      <FiltrosRifas
        filtro="todas"
        contadores={contadores}
        onChangeFiltro={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "Todas" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Disponíveis" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Em análise" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pagas" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Negadas" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Reservadas" })).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("Deve chamar onChangeFiltro ao clicar em Disponíveis", () => {
    const mockOnChangeFiltro = vi.fn();

    render(
      <FiltrosRifas
        filtro="todas"
        contadores={contadores}
        onChangeFiltro={mockOnChangeFiltro}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: /Disponíveis/i }));

    expect(mockOnChangeFiltro).toHaveBeenCalledWith("disponivel");
  });

  it("Deve marcar o filtro atual como selecionado", () => {
    render(
      <FiltrosRifas
        filtro="pago"
        contadores={contadores}
        onChangeFiltro={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: /Pagas/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("tab", { name: /Todas/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("Deve usar chips maiores, scroll snap e borda acessível", () => {
    expect(painelAderidoStyles.filtrosContainer).toMatchObject({
      scrollSnapType: "x mandatory",
    });
    expect(painelAderidoStyles.filtroChip).toMatchObject({
      height: 44,
      border: "1.5px solid rgba(6, 61, 49, 0.14)",
      fontSize: "0.95rem",
      scrollSnapAlign: "start",
    });
    expect(painelAderidoStyles.filtroContadorExterno).toBeUndefined();
  });

  it("Deve aplicar contraste AA no filtro Negadas ativo", () => {
    render(
      <FiltrosRifas
        filtro="recusado"
        contadores={contadores}
        onChangeFiltro={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: /Negadas/i })).toHaveStyle({
      color: "#8E1F1F",
    });
  });

  it("Deve exibir Reservadas somente quando houver rifas reservadas", () => {
    render(
      <FiltrosRifas
        filtro="todas"
        contadores={{ ...contadores, todas: 6, reservado: 1 }}
        onChangeFiltro={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "Reservadas" })).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
