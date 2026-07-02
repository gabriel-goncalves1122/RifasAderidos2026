import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SecretariaTable } from "@/features/secretaria/membros/components/shared/SecretariaTable";
import type { AderidoSecretaria } from "@/features/secretaria/membros/types/secretariaLocalTypes";

const mockAderidos: AderidoSecretaria[] = [
  {
    id: "1",
    nome: "Gabriel",
    email: "gabriel@teste.com",
    cargo: "aderido",
    status_cadastro: "ativo",
    modalidade_adesao: "completo",
  },
  {
    id: "2",
    nome: "Ana",
    email: "ana@teste.com",
    cargo: "secretaria",
    status_cadastro: "pendente",
    modalidade_adesao: "meio",
  },
];

describe("SecretariaTable", () => {
  it("Deve renderizar a tabela com os aderidos", () => {
    render(
      <SecretariaTable
        aderidos={mockAderidos}
        sortBy={null}
        sortDir="asc"
        onToggleSort={vi.fn()}
        onSelecionar={vi.fn()}
      />,
    );

    expect(screen.getByText("Gabriel")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("gabriel@teste.com")).toBeInTheDocument();
  });

  it("Deve chamar onSelecionar ao clicar em uma linha", async () => {
    const onSelecionar = vi.fn();

    render(
      <SecretariaTable
        aderidos={mockAderidos}
        sortBy={null}
        sortDir="asc"
        onToggleSort={vi.fn()}
        onSelecionar={onSelecionar}
      />,
    );

    await userEvent.click(screen.getByText("Gabriel"));

    expect(onSelecionar).toHaveBeenCalledWith(mockAderidos[0]);
  });

  it("Deve chamar onToggleSort ao clicar no header", async () => {
    const onToggleSort = vi.fn();

    render(
      <SecretariaTable
        aderidos={mockAderidos}
        sortBy={null}
        sortDir="asc"
        onToggleSort={onToggleSort}
        onSelecionar={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByText("Usuário"));

    expect(onToggleSort).toHaveBeenCalledWith("nome");
  });

  it("Deve renderizar null quando lista vazia", () => {
    const { container } = render(
      <SecretariaTable
        aderidos={[]}
        sortBy={null}
        sortDir="asc"
        onToggleSort={vi.fn()}
        onSelecionar={vi.fn()}
      />,
    );

    expect(container.innerHTML).toBe("");
  });
});
