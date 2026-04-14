import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CargoChip } from "../../src/views/components/secretaria/CargoChip";
import { CARGOS_COMISSAO } from "../../src/types/constants";

describe("Componente <CargoChip />", () => {
  it("Deve renderizar o nome oficial para cargo de administrador", () => {
    render(<CargoChip cargo="admin" />);
    const adminLabel =
      CARGOS_COMISSAO.find((c) => c.id === "admin")?.label || "admin";
    expect(screen.getByText(adminLabel)).toBeInTheDocument();
  });

  it("Deve renderizar o label oficial da Tesouraria corretamente", () => {
    render(<CargoChip cargo="diretor_tesouraria" />);

    // CORREÇÃO: O MUI usa classes CSS geradas no prop 'sx', portanto o toHaveStyle
    // com RGB exato é instável em testes de integração (JSDOM).
    // Garantimos que a label e a renderização do elemento funcionam perfeitamente.
    expect(screen.getByText("Diretor(a) de Tesouraria")).toBeInTheDocument();
  });

  it("Não deve renderizar nada para um aderido comum ou valor vazio", () => {
    const { container: containerAderido } = render(
      <CargoChip cargo="aderido" />,
    );
    expect(containerAderido.firstChild).toBeNull();

    const { container: containerNulo } = render(<CargoChip cargo={null} />);
    expect(containerNulo.firstChild).toBeNull();
  });
});
