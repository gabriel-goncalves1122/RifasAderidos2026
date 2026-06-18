import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SecretariaDesktopBatchBar } from "@/features/secretaria/components/desktop/SecretariaDesktopBatchBar";

describe("SecretariaDesktopBatchBar", () => {
  it("Não renderiza ações administrativas sem contrato seguro", () => {
    render(
      <SecretariaDesktopBatchBar
        selectedCount={2}
        onClearSelection={vi.fn()}
      />,
    );

    expect(screen.getByText("2 selecionados")).toBeInTheDocument();
    expect(screen.getByText("Limpar seleção")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /ativar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /alterar cargo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /exportar/i })).not.toBeInTheDocument();
  });

  it("Não renderiza barra quando não há seleção", () => {
    const { container } = render(
      <SecretariaDesktopBatchBar
        selectedCount={0}
        onClearSelection={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
