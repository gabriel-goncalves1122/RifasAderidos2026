import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixStatusLegenda } from "@/features/tesouraria/components/pix/transacoes/shared/PixStatusLegenda";

describe("Componente: PixStatusLegenda", () => {
  it("Deve exibir os status principais da validação Pix", () => {
    render(<PixStatusLegenda />);

    expect(screen.getByText("Legenda de status")).toBeInTheDocument();
    expect(screen.getByText(/Aguardando validação:/i)).toBeInTheDocument();
    expect(screen.getByText(/Aceita:/i)).toBeInTheDocument();
    expect(screen.getByText(/Negada:/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem confirmação bancária:/i)).toBeInTheDocument();
  });

  it("Deve recolher e expandir a legenda no mobile", () => {
    render(<PixStatusLegenda colapsavel />);

    expect(screen.queryByText(/Aguardando validação:/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ver/i }));

    expect(screen.getByText(/Aguardando validação:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ocultar/i })).toBeInTheDocument();
  });
});
