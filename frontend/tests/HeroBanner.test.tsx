import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HeroBanner } from "../src/views/components/premios/HeroBanner"; // <-- Caminho correto

describe("Componente <HeroBanner />", () => {
  const mockOnEditClick = vi.fn();

  const infoSorteio = {
    titulo: "Grande Sorteio Final",
    data: "2026-12-25",
    descricao: "Concorra a prêmios incríveis!",
  };

  it("Deve renderizar o título, a descrição e formatar a data corretamente", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteio}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    // O título e a descrição devem estar visíveis
    expect(screen.getByText("Grande Sorteio Final")).toBeInTheDocument();
    expect(
      screen.getByText("Concorra a prêmios incríveis!"),
    ).toBeInTheDocument();

    // A data "2026-12-25" deve ter sido transformada para "25 de Dezembro de 2026"
    expect(screen.getByText(/25 de Dezembro de 2026/i)).toBeInTheDocument();
  });

  it("NÃO deve mostrar o botão de editar para usuários normais (Aderidos)", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteio}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.queryByLabelText("Editar Cabeçalho")).not.toBeInTheDocument();
  });

  it("Deve mostrar o botão de editar para Admins e permitir o clique", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteio}
        isAdmin={true}
        onEditClick={mockOnEditClick}
      />,
    );

    const btnEdit = screen.getByLabelText("Editar Cabeçalho");
    expect(btnEdit).toBeInTheDocument();

    fireEvent.click(btnEdit);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
  });
});
