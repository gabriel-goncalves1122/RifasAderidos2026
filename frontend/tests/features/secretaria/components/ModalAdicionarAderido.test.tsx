// ============================================================================
// ARQUIVO: frontend/tests/secretaria/ModalAdicionarAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ModalAdicionarAderido } from "@/features/secretaria/components/shared/ModalAdicionarAderido";

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
      name: /Adicionar membro/i,
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

  it("Deve expandir os cargos ao selecionar vínculo de Comissão", async () => {
    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const areaComissao = screen.getByTestId("area-comissao");

    expect(areaComissao).not.toBeVisible();

    fireEvent.mouseDown(screen.getByLabelText("Vínculo"));
    fireEvent.click(screen.getByRole("option", { name: "Comissão" }));

    await waitFor(() => {
      expect(areaComissao).toBeVisible();
    });

    expect(
      screen.queryByText(/Defina cargo apenas quando fizer parte da equipe/i),
    ).not.toBeInTheDocument();
  });

  it("Deve oferecer curso Não informado", () => {
    render(
      <ModalAdicionarAderido
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    fireEvent.mouseDown(screen.getByLabelText("Curso"));

    expect(screen.getByRole("option", { name: "Não informado" })).toBeInTheDocument();
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
      "  NOVO@UNIFEI.BR  ",
    );

    fireEvent.change(screen.getByRole("textbox", { name: /Nome completo/i }), {
      target: { value: "  jOÃO   da SILVA  " },
    });

    await user.type(screen.getByLabelText(/Telefone/i), "35999998888");

    expect(screen.getByLabelText(/Telefone/i)).toHaveValue("(35) 99999-8888");

    await user.click(
      screen.getByRole("button", {
        name: /Adicionar membro/i,
      }),
    );

    expect(mockOnConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "novo@unifei.br",
        nome: "João da Silva",
        telefone: "35999998888",
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
        name: /Adicionar membro/i,
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
