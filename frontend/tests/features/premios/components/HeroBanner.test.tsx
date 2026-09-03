import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HeroBanner } from "@/features/premios/components/shared/HeroBanner";

describe("Componente <HeroBanner />", () => {
  const mockOnEditClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const infoSorteioFuturo = {
    titulo: "Grande Sorteio Final",
    data: "2026-12-25",
    descricao: "Concorra a prêmios incríveis!",
  };

  const infoSorteioPassado = {
    titulo: "Sorteio Realizado",
    data: "2024-01-01",
    descricao: "Já aconteceu.",
  };

  it("Deve renderizar o título, a descrição e a data formatada", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteioFuturo}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.getByText("Grande Sorteio Final")).toBeInTheDocument();
    expect(
      screen.getByText("Concorra a prêmios incríveis!"),
    ).toBeInTheDocument();
    expect(screen.getByText(/25 de Dezembro de 2026/i)).toBeInTheDocument();
  });

  it("NÃO deve mostrar o botão de editar para usuários normais", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteioFuturo}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );
    expect(screen.queryByLabelText("Editar Cabeçalho")).not.toBeInTheDocument();
  });

  it("Deve mostrar o botão de editar para Admin e permitir o clique", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteioFuturo}
        isAdmin={true}
        onEditClick={mockOnEditClick}
      />,
    );

    const btnEdit = screen.getByLabelText("Editar Cabeçalho");
    expect(btnEdit).toBeInTheDocument();
    fireEvent.click(btnEdit);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
  });

  it("Deve exibir countdown com 'Sorteio realizado' para data passada", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteioPassado}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );
    expect(screen.getByText("Sorteio realizado")).toBeInTheDocument();
  });

  it("Deve exibir countdown com 'Faltam ... dias' para data futura", () => {
    render(
      <HeroBanner
        infoSorteio={infoSorteioFuturo}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );
    expect(screen.getByText(/Faltam \d+ dias/)).toBeInTheDocument();
  });
});
