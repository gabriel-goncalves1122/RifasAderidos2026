import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SecretariaFilterBar } from "@/features/secretaria/components/shared/SecretariaFilterBar";

describe("SecretariaFilterBar", () => {
  const defaultProps = {
    busca: "",
    onBuscaChange: vi.fn(),
  };

  it("Deve renderizar somente o campo de pesquisa", () => {
    render(<SecretariaFilterBar {...defaultProps} />);

    expect(screen.getByPlaceholderText(/Pesquisar por nome ou e-mail/i)).toBeInTheDocument();
    expect(screen.queryByText("Modalidade")).not.toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(screen.queryByText("Tipo de usuário")).not.toBeInTheDocument();
  });

  it("Deve chamar onBuscaChange ao digitar", () => {
    const onBuscaChange = vi.fn();

    render(<SecretariaFilterBar {...defaultProps} onBuscaChange={onBuscaChange} />);

    fireEvent.change(screen.getByPlaceholderText(/Pesquisar por nome ou e-mail/i), {
      target: { value: "Maria" },
    });

    expect(onBuscaChange).toHaveBeenCalledWith("Maria");
  });

  it("Nao deve renderizar chips de filtros", () => {
    render(<SecretariaFilterBar {...defaultProps} />);

    expect(screen.queryByText("Limpar")).not.toBeInTheDocument();
  });
});
