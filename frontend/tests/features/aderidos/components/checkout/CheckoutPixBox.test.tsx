// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/CheckoutPixBox.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CheckoutPixBox } from "@/features/aderidos/components/checkout/CheckoutPixBox";

describe("Componente: CheckoutPixBox", () => {
  it("Deve orientar que o pagamento via Pix será gerado pelo sistema", () => {
    render(<CheckoutPixBox onCopiarPix={vi.fn()} />);

    expect(screen.getByText("Pagamento via Pix")).toBeInTheDocument();
    expect(
      screen.getByText(/O pagamento via Pix será gerado/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /copiar pix copia-e-cola/i }),
    ).not.toBeInTheDocument();
  });

  it("Deve exibir QR Code e Pix copia-e-cola quando houver cobrança", () => {
    render(
      <CheckoutPixBox
        cobranca={{
          id: "pix_001",
          status: "aguardando_pagamento",
          qrCodeImagemUrl: "https://example.com/qr.png",
          copiaECola: "000201PIXTESTE",
          expiraEm: "2026-06-07T18:00:00.000-03:00",
        }}
        onCopiarPix={vi.fn()}
      />,
    );

    expect(screen.getByAltText("QR Code Pix")).toHaveAttribute(
      "src",
      "https://example.com/qr.png",
    );
    expect(screen.getByText("000201PIXTESTE")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copiar pix copia-e-cola/i }),
    ).toBeInTheDocument();
  });

  it("Deve exibir CTA para abrir app de banco quando informado", () => {
    render(
      <CheckoutPixBox
        cobranca={{
          id: "pix_001",
          status: "aguardando_pagamento",
          copiaECola: "000201PIXTESTE",
        }}
        onCopiarPix={vi.fn()}
        onAbrirAppBanco={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /abrir app de banco/i }),
    ).toBeInTheDocument();
  });

  it("Deve chamar onCopiarPix ao clicar no botão de copiar", async () => {
    const user = userEvent.setup();
    const onCopiarPix = vi.fn();

    render(
      <CheckoutPixBox
        cobranca={{
          id: "pix_001",
          status: "aguardando_pagamento",
          copiaECola: "000201PIXTESTE",
        }}
        onCopiarPix={onCopiarPix}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /copiar pix copia-e-cola/i }),
    );

    expect(onCopiarPix).toHaveBeenCalledTimes(1);
  });

  it("Deve mostrar loading e erro quando informados", () => {
    const { rerender } = render(
      <CheckoutPixBox gerando onCopiarPix={vi.fn()} />,
    );

    expect(screen.getByText(/Gerando pagamento via Pix/i)).toBeInTheDocument();

    rerender(
      <CheckoutPixBox erro="Pix indisponível" onCopiarPix={vi.fn()} />,
    );

    expect(screen.getByText("Pix indisponível")).toBeInTheDocument();
  });
});
