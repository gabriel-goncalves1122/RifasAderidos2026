import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CargoChip } from "../../src/views/components/secretaria/CargoChip";

describe("Componente <CargoChip />", () => {
  it("Deve renderizar 'Administrador' para cargo admin", () => {
    render(<CargoChip cargo="admin" />);
    expect(screen.getByText("Administrador")).toBeInTheDocument();
  });

  it("Deve renderizar 'Secretaria' para cargo secretaria", () => {
    render(<CargoChip cargo="secretaria" />);
    expect(screen.getByText("Secretaria")).toBeInTheDocument();
  });

  it("Não deve renderizar nada para um aderido comum", () => {
    const { container } = render(<CargoChip cargo="aderido" />);
    expect(container.firstChild).toBeNull();
  });
});
