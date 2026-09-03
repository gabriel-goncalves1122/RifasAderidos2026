import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusChip } from "@/features/secretaria/membros/components/shared/StatusChip";

describe("Componente <StatusChip />", () => {
  it("Deve mostrar 'Conta Ativa' quando o status for ativo", () => {
    render(<StatusChip status="ativo" />);

    expect(screen.getByText("Conta Ativa")).toBeInTheDocument();
  });

  it("Deve mostrar 'Pendente' quando o status for pendente", () => {
    render(<StatusChip status="pendente" />);

    // O texto foi simplificado para manter a tabela mais limpa visualmente.
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });
});
