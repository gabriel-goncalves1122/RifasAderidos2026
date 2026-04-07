import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ModalImagemPix } from "../src/views/components/ModalImagemPix"; // <-- Caminho correto

describe("Componente <ModalImagemPix />", () => {
  const mockOnClose = vi.fn();

  it("Não deve renderizar a imagem se a URL for null", () => {
    render(<ModalImagemPix url={null} onClose={mockOnClose} />);
    // O modal usa MUI Dialog, que oculta o conteúdo se open for false (!!url)
    expect(
      screen.queryByRole("img", { name: "Comprovante Pix" }),
    ).not.toBeInTheDocument();
  });

  it("Deve renderizar a imagem e fechar ao clicar no X", () => {
    render(
      <ModalImagemPix url="http://meusite.com/pix.jpg" onClose={mockOnClose} />,
    );

    // A imagem deve estar presente
    const imagem = screen.getByRole("img", { name: "Comprovante Pix" });
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveAttribute("src", "http://meusite.com/pix.jpg");

    // Testar o botão de fechar
    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
