import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SecretariaCardList } from "@/features/secretaria/components/shared/SecretariaCardList";
import type { AderidoSecretaria } from "@/features/secretaria/types";

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

describe("SecretariaCardList", () => {
  it("Deve renderizar cards para cada aderido", () => {
    render(<SecretariaCardList aderidos={mockAderidos} onSelecionar={vi.fn()} />);

    expect(screen.getByText("Gabriel")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("gabriel@teste.com")).toBeInTheDocument();
    expect(screen.getByText("ana@teste.com")).toBeInTheDocument();
  });

  it("Deve chamar onSelecionar ao clicar", async () => {
    const onSelecionar = vi.fn();

    render(<SecretariaCardList aderidos={mockAderidos} onSelecionar={onSelecionar} />);

    await userEvent.click(screen.getByText("Gabriel"));

    expect(onSelecionar).toHaveBeenCalledWith(mockAderidos[0]);
  });

  it("Deve renderizar null quando lista vazia", () => {
    const { container } = render(<SecretariaCardList aderidos={[]} onSelecionar={vi.fn()} />);

    expect(container.innerHTML).toBe("");
  });
});
