// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/LoadingRifasState.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingRifasState } from "@/features/aderidos/components/LoadingRifasState";

describe("Componente: LoadingRifasState", () => {
  it("Deve renderizar mensagem de carregamento das rifas", () => {
    render(<LoadingRifasState />);

    expect(screen.getByText(/carregando suas rifas/i)).toBeInTheDocument();
  });

  it("Deve renderizar um indicador de progresso", () => {
    render(<LoadingRifasState />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
