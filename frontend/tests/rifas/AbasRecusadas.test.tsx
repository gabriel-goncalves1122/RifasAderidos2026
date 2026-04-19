// ============================================================================
// ARQUIVO: frontend/tests/aderidos/AbaRecusadas.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AbaRecusadas } from "../../src/views/components/aderidos/AbaRecusadas";

describe("Componente: AbaRecusadas", () => {
  const mockGrupos = [
    {
      comprador: "Gabriel Sampaio",
      data: "2026-04-19T10:00:00.000Z",
      motivo: "Comprovativo ilegível.",
      bilhetes: ["015", "016"],
    },
  ];

  it("Deve renderizar o título e as informações do grupo recusado corretamente", () => {
    render(
      <AbaRecusadas
        gruposRecusados={mockGrupos}
        onVoltar={vi.fn()}
        onAbrirCorrecao={vi.fn()}
      />,
    );

    // Título e Descrição
    expect(
      screen.getByText(/Vendas Negadas pela Tesouraria/i),
    ).toBeInTheDocument();

    // Dados do Card
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText(/Comprovativo ilegível/i)).toBeInTheDocument();

    // Chips das rifas
    expect(screen.getByText("015")).toBeInTheDocument();
    expect(screen.getByText("016")).toBeInTheDocument();
  });

  it("Deve chamar a função onVoltar ao clicar no botão de voltar", () => {
    const mockVoltar = vi.fn();
    const { container } = render(
      <AbaRecusadas
        gruposRecusados={mockGrupos}
        onVoltar={mockVoltar}
        onAbrirCorrecao={vi.fn()}
      />,
    );

    // Encontra o botão de voltar (como tem o ícone ArrowBack, podemos buscar pelo componente do botão)
    const btnVoltar = container.querySelector("button");
    if (btnVoltar) fireEvent.click(btnVoltar);

    expect(mockVoltar).toHaveBeenCalledTimes(1);
  });

  it("Deve chamar a função onAbrirCorrecao com o grupo exato ao clicar no botão", () => {
    const mockAbrirCorrecao = vi.fn();
    render(
      <AbaRecusadas
        gruposRecusados={mockGrupos}
        onVoltar={vi.fn()}
        onAbrirCorrecao={mockAbrirCorrecao}
      />,
    );

    const btnCorrigir = screen.getByRole("button", {
      name: /Corrigir Informações/i,
    });
    fireEvent.click(btnCorrigir);

    expect(mockAbrirCorrecao).toHaveBeenCalledTimes(1);
    expect(mockAbrirCorrecao).toHaveBeenCalledWith(mockGrupos[0]);
  });
});
