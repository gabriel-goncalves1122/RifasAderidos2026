import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PremioCard } from "@/features/premios/components/shared/PremioCard";

describe("Componente <PremioCard />", () => {
  const mockOnEditClick = vi.fn();

  const premioSemImagem = {
    id: "premio_1",
    colocacao: "1º Lugar",
    titulo: "Notebook Gamer",
    descricao: "Um notebook super rápido.",
    imagem_url: null,
  };

  const premioComImagem = {
    id: "premio_2",
    colocacao: "2º Lugar",
    titulo: "Smartwatch",
    descricao: "Relógio inteligente.",
    imagem_url: "http://meusite.com/relogio.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve exibir os textos corretamente e mostrar o ícone padrão se não houver imagem", () => {
    render(
      <PremioCard
        premio={premioSemImagem}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.getByText("1º Lugar")).toBeInTheDocument();
    expect(screen.getByText("Notebook Gamer")).toBeInTheDocument();
    expect(
      screen.getByText("Um notebook super rápido."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Editar Prêmio")).not.toBeInTheDocument();
  });

  it("Deve renderizar a imagem se a URL for fornecida", () => {
    render(
      <PremioCard
        premio={premioComImagem}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    const imagem = screen.getByRole("img", { name: "Smartwatch" });
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveAttribute("src", "http://meusite.com/relogio.png");
  });

  it("Deve mostrar o botão de editar para Admin e disparar a função correta", () => {
    render(
      <PremioCard
        premio={premioSemImagem}
        isAdmin={true}
        onEditClick={mockOnEditClick}
      />,
    );

    const btnEditar = screen.getByLabelText("Editar Prêmio");
    expect(btnEditar).toBeInTheDocument();

    fireEvent.click(btnEditar);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    expect(mockOnEditClick).toHaveBeenCalledWith(premioSemImagem);
  });
});
