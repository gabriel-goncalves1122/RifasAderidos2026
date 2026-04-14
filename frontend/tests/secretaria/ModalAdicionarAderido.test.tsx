import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ModalAdicionarAderido } from "../../src/views/components/secretaria/ModalAdicionarAderido";

describe("Componente <ModalAdicionarAderido />", () => {
  it("Deve impedir submissão sem e-mail", async () => {
    window.alert = vi.fn();
    const mockOnConfirm = vi.fn();

    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={mockOnConfirm}
      />,
    );

    const botaoSalvar = screen.getByRole("button", {
      name: /Autorizar Acesso/i,
    });
    fireEvent.click(botaoSalvar);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("Deve expandir os cargos ao clicar no checkbox da Comissão", async () => {
    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    // A área de comissão não deve estar visível porque o Collapse injeta a classe MuiCollapse-hidden
    const areaComissao = screen.getByTestId("area-comissao");
    expect(areaComissao).not.toBeVisible();

    // Clica no checkbox
    const checkbox = screen.getByRole("checkbox", {
      name: "Checkbox Comissão",
    });
    fireEvent.click(checkbox);

    // Espera que a animação ocorra e a div fique visível
    await waitFor(() => {
      expect(areaComissao).toBeVisible();
    });
  });

  it("Deve recolher os dados corretos e invocar o onConfirm", async () => {
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

    const nomeInput = screen.getByRole("textbox", { name: /Nome Completo/i });
    await user.type(nomeInput, "João Teste");

    const botaoSalvar = screen.getByRole("button", {
      name: /Autorizar Acesso/i,
    });
    await user.click(botaoSalvar);

    expect(mockOnConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "novo@unifei.br",
        nome: "João Teste",
        cargo: "aderido", // Por predefinição, envia "aderido" se a checkbox não foi clicada
      }),
    );
  });
});
