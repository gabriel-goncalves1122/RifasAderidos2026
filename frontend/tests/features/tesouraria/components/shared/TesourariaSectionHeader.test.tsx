import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TesourariaSectionHeader } from "@/features/tesouraria/components/shared/TesourariaSectionHeader";

describe("Componente: TesourariaSectionHeader", () => {
  it("deve renderizar eyebrow, título, subtítulo e ação opcional", () => {
    render(
      <TesourariaSectionHeader
        eyebrow="Histórico"
        titulo="Auditoria de compras"
        subtitulo="Revise os dados sem alterar vínculos."
        action={<button type="button">Atualizar</button>}
      />,
    );

    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Auditoria de compras")).toBeInTheDocument();
    expect(screen.getByText(/sem alterar vínculos/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /atualizar/i })).toBeInTheDocument();
  });
});
