// ============================================================================
// ARQUIVO: frontend/tests/secretaria/ModalAdicionarAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ModalAdicionarAderido } from "@/features/secretaria/components/ModalAdicionarAderido";

describe("Componente <ModalAdicionarAderido />", () => {
  it("Deve impedir submissão sem e-mail", async () => {
    const mockOnConfirm = vi.fn();

    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={mockOnConfirm}
      />,
    );

    const botaoSalvar = screen.getByRole("button", {
      name: /Autorizar Adesão/i,
    });

    fireEvent.click(botaoSalvar);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("Deve exibir a escolha de tipo de cadastro como primeira decisão do modal", () => {
    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Tipo de cadastro")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Aderido completo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Meio-aderido/i }),
    ).toBeInTheDocument();
  });

  it("Deve expandir os cargos ao clicar no checkbox da Comissão", async () => {
    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const areaComissao = screen.getByTestId("area-comissao");

    expect(areaComissao).not.toBeVisible();

    const checkbox = screen.getByRole("checkbox", {
      name: "Checkbox Comissão",
    });

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(areaComissao).toBeVisible();
    });
  });

  it("Deve recolher os dados corretos e invocar o onConfirm como aderido completo por padrão", async () => {
    const user = userEvent.setup();
    const mockOnConfirm = vi.fn();

    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={mockOnConfirm}
      />,
    );

    await user.type(
      screen.getByLabelText(/E-mail da Keeper/i),
      "novo@unifei.br",
    );

    await user.type(
      screen.getByRole("textbox", { name: /Nome completo/i }),
      "João Teste",
    );

    await user.click(
      screen.getByRole("button", {
        name: /Autorizar Adesão/i,
      }),
    );

    expect(mockOnConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "novo@unifei.br",
        nome: "João Teste",
        cargo: "aderido",
        modalidade_adesao: "completo",
      }),
    );
  });

  it("Deve enviar modalidade_adesao como meio quando selecionar Meio-aderido", async () => {
    const user = userEvent.setup();
    const mockOnConfirm = vi.fn();

    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={mockOnConfirm}
      />,
    );

    // A modalidade é regra administrativa, separada do cargo/permissão.
    await user.click(screen.getByRole("button", { name: /Meio-aderido/i }));

    await user.type(
      screen.getByLabelText(/E-mail da Keeper/i),
      "meio@unifei.br",
    );

    await user.click(
      screen.getByRole("button", {
        name: /Autorizar Adesão/i,
      }),
    );

    expect(mockOnConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "meio@unifei.br",
        cargo: "aderido",
        modalidade_adesao: "meio",
      }),
    );
  });
});
