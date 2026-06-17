import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SecretariaMobileSwipeableCard } from "@/features/secretaria/components/mobile/SecretariaMobileSwipeableCard";
import type { AderidoSecretaria } from "@/features/secretaria/types";

const aderido: AderidoSecretaria = {
  id: "1",
  nome: "Gabriel",
  email: "gabriel@teste.com",
  cargo: "aderido",
  status_cadastro: "ativo",
  modalidade_adesao: "completo",
};

describe("SecretariaMobileSwipeableCard", () => {
  it("Deve renderizar os dados principais do aderido", () => {
    render(<SecretariaMobileSwipeableCard aderido={aderido} onSelecionar={vi.fn()} />);

    expect(screen.getByText("Gabriel")).toBeInTheDocument();
    expect(screen.getByText("gabriel@teste.com")).toBeInTheDocument();
  });

  it("Deve abrir detalhes ao clicar no card", async () => {
    const onSelecionar = vi.fn();

    render(<SecretariaMobileSwipeableCard aderido={aderido} onSelecionar={onSelecionar} />);

    await userEvent.click(
      screen.getByRole("button", { name: /abrir detalhes de gabriel/i }),
    );

    expect(onSelecionar).toHaveBeenCalledWith(aderido);
  });

  it("Nao deve renderizar menu redundante de acoes", () => {
    render(<SecretariaMobileSwipeableCard aderido={aderido} onSelecionar={vi.fn()} />);

    expect(screen.queryByLabelText(/mais ações/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
  });
});
