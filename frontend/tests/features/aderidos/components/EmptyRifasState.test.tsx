// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/EmptyRifasState.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyRifasState } from "@/features/aderidos/components/EmptyRifasState";

describe("Componente: EmptyRifasState", () => {
  it("Deve renderizar o estado vazio quando nenhuma rifa for encontrada", () => {
    render(<EmptyRifasState />);

    expect(screen.getByText(/nenhuma rifa encontrada/i)).toBeInTheDocument();
  });

  it("Deve orientar o usuário a ajustar o filtro", () => {
    render(<EmptyRifasState />);

    expect(
      screen.getByText(/ajuste o filtro para visualizar outras categorias/i),
    ).toBeInTheDocument();
  });
});
