// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/CheckoutResumoVenda.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CheckoutResumoVenda } from "@/features/aderidos/components/checkout/CheckoutResumoVenda";

describe("Componente: CheckoutResumoVenda", () => {
  it("Deve renderizar o título e a orientação da venda", () => {
    render(<CheckoutResumoVenda numerosRifas={["001", "002"]} />);

    expect(screen.getByText("Resumo da venda")).toBeInTheDocument();
  });

  it("Deve exibir todos os números das rifas selecionadas", () => {
    render(<CheckoutResumoVenda numerosRifas={["001", "025", "100"]} />);

    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("025")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("Deve calcular e exibir o valor total da venda", () => {
    render(<CheckoutResumoVenda numerosRifas={["001", "002", "003"]} />);

    // Cada rifa custa R$ 10,00, então 3 rifas = R$ 30,00.
    expect(screen.getByText(/R\$\s*30,00/i)).toBeInTheDocument();
  });

  it("Deve exibir R$ 0,00 quando nenhuma rifa for informada", () => {
    render(<CheckoutResumoVenda numerosRifas={[]} />);

    expect(screen.getByText(/R\$\s*0,00/i)).toBeInTheDocument();
  });
});
