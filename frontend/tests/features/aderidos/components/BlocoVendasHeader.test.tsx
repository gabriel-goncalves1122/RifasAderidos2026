// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/BlocoVendasHeader.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BlocoVendasHeader } from "@/features/aderidos/components/BlocoVendasHeader";

describe("Componente: BlocoVendasHeader", () => {
  it("Deve renderizar o título principal do bloco de vendas", () => {
    render(<BlocoVendasHeader />);

    // O componente renderiza o título como Typography padrão, não como heading.
    expect(screen.getByText("Suas rifas")).toBeInTheDocument();
  });

  it("Deve renderizar o botão de ajuda com orientação acessível", () => {
    render(<BlocoVendasHeader />);

    expect(
      screen.getByRole("button", {
        name: /toque nas rifas disponíveis para selecionar/i,
      }),
    ).toBeInTheDocument();
  });
});
