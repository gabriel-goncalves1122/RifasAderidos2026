// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/SecretariaHeader.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SecretariaHeader } from "@/features/secretaria/components/SecretariaHeader";

describe("Componente: SecretariaHeader", () => {
  it("Deve renderizar o título do painel da secretaria", () => {
    render(<SecretariaHeader />);

    expect(
      screen.getByRole("heading", {
        name: /painel da secretaria/i,
      }),
    ).toBeInTheDocument();
  });

  it("Deve renderizar a descrição do painel", () => {
    render(<SecretariaHeader />);

    expect(
      screen.getByText(
        /gestão da lista oficial de aderidos e membros da comissão/i,
      ),
    ).toBeInTheDocument();
  });

  it("Não deve renderizar ações diretas no cabeçalho", () => {
    render(<SecretariaHeader />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
