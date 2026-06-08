// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/FiltrosRifas.test.tsx
// ============================================================================
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FiltrosRifas } from "@/features/aderidos/components/FiltrosRifas";
import { painelAderidoStyles } from "@/features/aderidos/styles/painelAderidoStyles";

describe("Componente <FiltrosRifas />", () => {
  it("Deve renderizar todos os filtros principais", () => {
    render(<FiltrosRifas filtro="todas" onChangeFiltro={vi.fn()} />);

    expect(screen.getByRole("tab", { name: /Todas/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Disponíveis/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Em análise/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Pagas/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Negadas/i })).toBeInTheDocument();
  });

  it("Deve chamar onChangeFiltro ao clicar em Disponíveis", () => {
    const mockOnChangeFiltro = vi.fn();

    render(<FiltrosRifas filtro="todas" onChangeFiltro={mockOnChangeFiltro} />);

    fireEvent.click(screen.getByRole("tab", { name: /Disponíveis/i }));

    expect(mockOnChangeFiltro).toHaveBeenCalledWith("disponivel");
  });

  it("Deve marcar o filtro atual como selecionado", () => {
    render(<FiltrosRifas filtro="pago" onChangeFiltro={vi.fn()} />);

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
  });

  it("Deve aplicar contraste AA no filtro Negadas ativo", () => {
    render(<FiltrosRifas filtro="recusado" onChangeFiltro={vi.fn()} />);

    expect(screen.getByRole("tab", { name: /Negadas/i })).toHaveStyle({
      color: "#8E1F1F",
    });
  });
});
