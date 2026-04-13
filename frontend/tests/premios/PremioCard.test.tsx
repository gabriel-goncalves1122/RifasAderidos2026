// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/PremioCard.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PremioCard } from "../../src/views/components/premios/PremioCard"; // <-- Caminho correto

describe("Componente <PremioCard />", () => {
  const mockOnEditClick = vi.fn();

  const premioSemImagem = {
    id: "premio_1",
    colocacao: 1,
    titulo: "Notebook Gamer",
    descricao: "Um notebook super rápido para o primeiro sorteado.",
    imagem_url: null, // Testando o fallback de imagem
  };

  const premioComImagem = {
    id: "premio_2",
    colocacao: 2,
    titulo: "Smartwatch",
    descricao: "Relógio inteligente.",
    imagem_url: "http://meusite.com/relogio.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // TESTE 1: Renderização de Textos e Fallback Visual (Usuário Normal)
  // ========================================================================
  it("Deve exibir os textos corretamente e mostrar o ícone padrão se não houver imagem", () => {
    render(
      <PremioCard
        premio={premioSemImagem}
        isAdmin={false} // Usuário normal
        onEditClick={mockOnEditClick}
      />,
    );

    // Verifica os textos
    expect(screen.getByText("1")).toBeInTheDocument(); // Colocação
    expect(screen.getByText("Notebook Gamer")).toBeInTheDocument();
    expect(
      screen.getByText("Um notebook super rápido para o primeiro sorteado."),
    ).toBeInTheDocument();

    // Como é usuário normal, o botão de edição NÃO deve existir na tela
    expect(screen.queryByLabelText("Editar Prêmio")).not.toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: Renderização de Imagem
  // ========================================================================
  it("Deve renderizar a imagem se a URL for fornecida", () => {
    render(
      <PremioCard
        premio={premioComImagem}
        isAdmin={false}
        onEditClick={mockOnEditClick}
      />,
    );

    // Procura por um elemento <img> que tenha a role de imagem/alt text do título
    const imagem = screen.getByRole("img", { name: "Smartwatch" });
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveAttribute("src", "http://meusite.com/relogio.png");
  });

  // ========================================================================
  // TESTE 3: Regra de Negócio (Permissões de Admin)
  // ========================================================================
  it("Deve mostrar o botão de editar para o Admin e disparar a função correta", () => {
    render(
      <PremioCard
        premio={premioSemImagem}
        isAdmin={true} // AGORA É ADMIN!
        onEditClick={mockOnEditClick}
      />,
    );

    // O botão agora deve aparecer na tela
    const btnEditar = screen.getByLabelText("Editar Prêmio");
    expect(btnEditar).toBeInTheDocument();

    // Ao clicar no botão, ele deve devolver o objeto do prêmio inteiro para o componente pai
    fireEvent.click(btnEditar);
    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    expect(mockOnEditClick).toHaveBeenCalledWith(premioSemImagem);
  });
});
