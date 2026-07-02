import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { CheckoutDadosCompradorForm } from "@/features/aderidos/components/checkout/CheckoutDadosCompradorForm";
import { CheckoutFormData } from "@/features/aderidos/components/checkout/checkoutSchema";

function criarRegister() {
  return vi.fn((name: keyof CheckoutFormData) => ({
    name,
    onBlur: vi.fn(),
    ref: vi.fn(),
  })) as unknown as UseFormRegister<CheckoutFormData>;
}

describe("Componente: CheckoutDadosCompradorForm", () => {
  it("Deve exibir helper simples para e-mail opcional", () => {
    render(
      <CheckoutDadosCompradorForm
        register={criarRegister()}
        setValue={vi.fn() as unknown as UseFormSetValue<CheckoutFormData>}
        errors={{}}
      />,
    );

    expect(
      screen.getByText(/Para enviar comprovante \(opcional\)/i),
    ).toBeInTheDocument();
  });

  it("Deve aplicar máscara de telefone usando setValue", () => {
    const setValue = vi.fn();

    render(
      <CheckoutDadosCompradorForm
        register={criarRegister()}
        setValue={setValue as unknown as UseFormSetValue<CheckoutFormData>}
        errors={{}}
      />,
    );

    fireEvent.change(screen.getByTestId("checkout-telefone"), {
      target: { value: "35999998888" },
    });

    expect(setValue).toHaveBeenCalledWith("telefone", "(35) 99999-8888", {
      shouldValidate: true,
      shouldDirty: true,
    });
  });

  it("Deve aplicar máscara de CPF usando setValue", () => {
    const setValue = vi.fn();

    render(
      <CheckoutDadosCompradorForm
        register={criarRegister()}
        setValue={setValue as unknown as UseFormSetValue<CheckoutFormData>}
        errors={{}}
      />,
    );

    fireEvent.change(screen.getByTestId("checkout-documento"), {
      target: { value: "12345678909" },
    });

    expect(setValue).toHaveBeenCalledWith("documento", "123.456.789-09", {
      shouldValidate: true,
      shouldDirty: true,
    });
  });

  it("Deve exibir helper simples para CPF opcional", () => {
    render(
      <CheckoutDadosCompradorForm
        register={criarRegister()}
        setValue={vi.fn() as unknown as UseFormSetValue<CheckoutFormData>}
        errors={{}}
      />,
    );

    expect(
      screen.getByText(/Ajuda na validação do pagamento/i),
    ).toBeInTheDocument();
  });

  it("Deve priorizar mensagem de erro do e-mail", () => {
    render(
      <CheckoutDadosCompradorForm
        register={criarRegister()}
        setValue={vi.fn() as unknown as UseFormSetValue<CheckoutFormData>}
        errors={{
          email: {
            type: "email",
            message: "E-mail inválido.",
          },
        }}
      />,
    );

    expect(screen.getByText("E-mail inválido.")).toBeInTheDocument();
    expect(
      screen.queryByText(/Para enviar comprovante \(opcional\)/i),
    ).not.toBeInTheDocument();
  });
});
