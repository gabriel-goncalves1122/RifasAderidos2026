// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/CheckoutPixBox.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CheckoutPixBox } from "@/features/aderidos/components/checkout/CheckoutPixBox";
import { CHAVE_PIX_COMISSAO } from "@/features/aderidos/components/checkout/utils/checkoutUtils";

describe("Componente: CheckoutPixBox", () => {
  it("Deve renderizar as informações de pagamento via PIX", () => {
    render(<CheckoutPixBox onCopiarPix={vi.fn()} />);

    expect(screen.getByText("Pagamento via PIX")).toBeInTheDocument();
    expect(screen.getByText(CHAVE_PIX_COMISSAO)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copiar chave pix/i }),
    ).toBeInTheDocument();
  });

  it("Deve chamar onCopiarPix ao clicar no botão de copiar chave PIX", async () => {
    const user = userEvent.setup();
    const onCopiarPix = vi.fn();

    render(<CheckoutPixBox onCopiarPix={onCopiarPix} />);

    await user.click(screen.getByRole("button", { name: /copiar chave pix/i }));

    expect(onCopiarPix).toHaveBeenCalledTimes(1);
  });
});
