import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HeroPremioCard } from "@/features/premios/components/desktop/HeroPremioCard";

describe("Componente <HeroPremioCard />", () => {
  const mockOnEditClick = vi.fn();

  const premioHero = {
    id: "premio_1",
    colocacao: "1º Lugar",
    titulo: "Carro Zero",
    descricao: "Carro 0km completo.",
    imagem_url: null,
  };

  const premioHeroComImagem = {
    id: "premio_2",
    colocacao: "1º Lugar",
    titulo: "Viagem dos Sonhos",
    descricao: "Passagem aérea + hotel.",
    imagem_url: "http://meusite.com/viagem.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve exibir badge de colocação, título e descrição", () => {
    render(
      <HeroPremioCard
        premio={premioHero}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.getByText("1º Lugar")).toBeInTheDocument();
    expect(screen.getByText("Carro Zero")).toBeInTheDocument();
    expect(
      screen.getByText("Carro 0km completo."),
    ).toBeInTheDocument();
  });

  it("Deve renderizar imagem quando URL é fornecida", () => {
    render(
      <HeroPremioCard
        premio={premioHeroComImagem}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    const imagem = screen.getByRole("img", { name: "Viagem dos Sonhos" });
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveAttribute("src", "http://meusite.com/viagem.png");
  });

  it("Deve exibir ícone padrão quando não há imagem", () => {
    render(
      <HeroPremioCard
        premio={premioHero}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("NÃO deve mostrar botão de editar para usuário normal", () => {
    render(
      <HeroPremioCard
        premio={premioHero}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.queryByLabelText("Editar Prêmio")).not.toBeInTheDocument();
  });

  it("Deve mostrar botão de editar para Admin e disparar callback", () => {
    render(
      <HeroPremioCard
        premio={premioHero}
        isAdmin={true}
        onEditClick={mockOnEditClick}
      />,
    );

    const btn = screen.getByLabelText("Editar Prêmio");
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    expect(mockOnEditClick).toHaveBeenCalledWith(premioHero);
  });
});
