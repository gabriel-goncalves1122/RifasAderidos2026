// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/CheckoutUploadComprovante.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CheckoutUploadComprovante } from "@/features/aderidos/legacy/checkout/CheckoutUploadComprovante";

describe("Componente: CheckoutUploadComprovante", () => {
  it("Deve renderizar o botão para anexar comprovante quando não há arquivo", () => {
    render(
      <CheckoutUploadComprovante
        arquivo={undefined}
        setValue={vi.fn() as any}
        errors={{}}
      />,
    );

    expect(
      screen.getByRole("button", { name: /anexar comprovante do pix/i }),
    ).toBeInTheDocument();
  });

  it("Deve exibir o nome do arquivo quando já existe comprovante anexado", () => {
    const arquivo = new File(["conteudo"], "comprovante.png", {
      type: "image/png",
    });

    render(
      <CheckoutUploadComprovante
        arquivo={arquivo}
        setValue={vi.fn() as any}
        errors={{}}
      />,
    );

    expect(screen.getByText("comprovante.png")).toBeInTheDocument();
  });

  it("Deve chamar setValue com o arquivo selecionado", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();

    const arquivo = new File(["conteudo"], "pix.pdf", {
      type: "application/pdf",
    });

    render(
      <CheckoutUploadComprovante
        arquivo={undefined}
        setValue={setValue as any}
        errors={{}}
      />,
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, arquivo);

    expect(setValue).toHaveBeenCalledWith("comprovante", arquivo, {
      shouldValidate: true,
      shouldDirty: true,
    });
  });

  it("Deve mostrar mensagem de erro quando o comprovante for obrigatório", () => {
    render(
      <CheckoutUploadComprovante
        arquivo={undefined}
        setValue={vi.fn() as any}
        errors={{
          comprovante: {
            type: "required",
            message: "Anexe o comprovante do PIX para finalizar a venda.",
          },
        }}
      />,
    );

    expect(
      screen.getByText("Anexe o comprovante do PIX para finalizar a venda."),
    ).toBeInTheDocument();
  });
});
