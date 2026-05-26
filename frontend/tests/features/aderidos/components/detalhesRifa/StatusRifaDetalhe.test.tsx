// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/StatusRifaDetalhe.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusRifaDetalhe } from "@/features/aderidos/components/detalhesRifa/StatusRifaDetalhe";

describe("Componente: StatusRifaDetalhe", () => {
  it("Deve renderizar o rótulo Status", () => {
    render(<StatusRifaDetalhe />);

    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("Deve renderizar o status aprovado usado no modal de detalhes da rifa paga", () => {
    render(<StatusRifaDetalhe />);

    expect(screen.getByText("Aprovada pela tesouraria")).toBeInTheDocument();
  });
});
