import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AdicionarDocumentoMenu } from "@/features/secretaria/documentos/components/shared/AdicionarDocumentoMenu";

describe("<AdicionarDocumentoMenu />", () => {
  it("abre mini ações e seleciona tipo de documento", async () => {
    const onSelecionarTipo = vi.fn();

    render(<AdicionarDocumentoMenu onSelecionarTipo={onSelecionarTipo} />);

    expect(screen.getByTestId("adicionar-documento-menu")).toHaveAttribute(
      "data-side",
      "right",
    );

    await userEvent.click(screen.getByRole("button", { name: "Adicionar documento" }));

    expect(screen.getByRole("button", { name: "Adicionar PDF" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar Planilha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar Imagem" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Adicionar Planilha" }));

    expect(onSelecionarTipo).toHaveBeenCalledWith("planilha");
  });
});
