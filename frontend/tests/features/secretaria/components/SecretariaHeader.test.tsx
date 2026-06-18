// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/SecretariaHeader.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SecretariaHeader } from "@/features/secretaria/components/shared/SecretariaHeader";

describe("Componente: SecretariaHeader", () => {
  const onNovaAdesao = vi.fn();

  const renderHeader = (props = {}) =>
    render(
      <SecretariaHeader
        total={10}
        onNovaAdesao={onNovaAdesao}
        {...props}
      />,
    );

  it("Deve renderizar o título do painel da secretaria", () => {
    renderHeader();

    expect(
      screen.getByRole("heading", {
        name: /secretaria/i,
      }),
    ).toBeInTheDocument();
  });

  it("Deve renderizar a descrição do painel", () => {
    renderHeader();

    expect(
      screen.getByText(
        /gestão de membros e aderidos da comissão/i,
      ),
    ).toBeInTheDocument();
  });

  it("Deve exibir a contagem total no botao", () => {
    renderHeader({ total: 42 });

    expect(screen.getByText("Nova Adesão (42)")).toBeInTheDocument();
  });

  it("Deve chamar onNovaAdesao ao clicar no botao", () => {
    renderHeader({ total: 5 });

    fireEvent.click(screen.getByRole("button", { name: /Nova Adesão/i }));

    expect(onNovaAdesao).toHaveBeenCalledTimes(1);
  });

  it("Nao deve renderizar navegacao por abas no header", () => {
    renderHeader();

    expect(screen.queryByRole("tab", { name: "Aderidos" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Comissão" })).not.toBeInTheDocument();
  });
});
