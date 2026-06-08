import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResumoCard } from "@/features/aderidos/components/resumo/ResumoCard";

describe("Componente: ResumoCard", () => {
  it("Deve renderizar ícone, label, valor, descrição e ação opcional", () => {
    render(
      <ResumoCard
        icon={<AccountBalanceWalletOutlinedIcon />}
        label="Arrecadado"
        valor="R$ 100,00"
        descricao="Confirmado nas vendas aprovadas."
        acao={<button type="button">Revisar</button>}
      />,
    );

    expect(screen.getByText("Arrecadado")).toBeInTheDocument();
    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
    expect(
      screen.getByText("Confirmado nas vendas aprovadas."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Revisar/i })).toBeInTheDocument();
  });
});
