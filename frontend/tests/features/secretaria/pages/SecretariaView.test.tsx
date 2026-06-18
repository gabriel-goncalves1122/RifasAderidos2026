import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";

const secretariaMocks = vi.hoisted(() => {
  const aderidos = [
    {
      id: "1",
      nome: "Aderido User",
      email: "aderido@teste.com",
      cargo: "aderido",
      status_cadastro: "ativo" as const,
      modalidade_adesao: "completo" as const,
    },
    {
      id: "2",
      nome: "Admin User",
      email: "admin@teste.com",
      cargo: "secretaria",
      status_cadastro: "ativo" as const,
      modalidade_adesao: "completo" as const,
    },
  ];

  return {
    aderidos,
    controllerReturn: {
      aderidos,
      loading: false,
      notificacao: { open: false, mensagem: "", severidade: "success" as const },
      busca: "",
      aderidoSelecionado: null,
      modalAberto: false,
      selectedIds: new Set<string>(),
      setBusca: vi.fn(),
      setAderidoSelecionado: vi.fn(),
      setModalAberto: vi.fn(),
      toggleSelectId: vi.fn(),
      toggleSelectAll: vi.fn(),
      limparSelecao: vi.fn(),
      carregarAderidos: vi.fn().mockResolvedValue(aderidos),
      adicionarAderidoIndividual: vi.fn(),
      atualizarAderidoSecretaria: vi.fn(),
      fecharNotificacao: vi.fn(),
    },
    sortReturn: {
      sorted: aderidos,
      sortBy: null,
      sortDir: "asc" as const,
      toggleSort: vi.fn(),
    },
  };
});

vi.mock("@/features/premios/hooks/usePremiosLayout", () => ({
  usePremiosLayout: vi.fn(() => ({ isMobile: false, isDesktop: true })),
}));

vi.mock("@/features/secretaria/hooks/useSecretariaController", () => ({
  useSecretariaController: vi.fn(() => secretariaMocks.controllerReturn),
}));

vi.mock("@/features/secretaria/hooks/useSecretariaSort", () => ({
  useSecretariaSort: vi.fn(() => secretariaMocks.sortReturn),
}));

vi.mock("@/features/secretaria/hooks/useSecretariaKeyboard", () => ({
  useSecretariaKeyboard: vi.fn(),
}));

import { SecretariaView } from "@/features/secretaria";

describe("Página <SecretariaView />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve renderizar o header e os cards de resumo", () => {
    render(React.createElement(SecretariaView));

    expect(screen.getByText("Secretaria")).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Resumo Total" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Resumo Aderidos" })).toBeInTheDocument();
  });

  it("Deve renderizar a view desktop por padrão", () => {
    render(React.createElement(SecretariaView));

    expect(screen.getByText("Resultados (1)")).toBeInTheDocument();
  });

  it("Deve iniciar na aba Aderidos e alternar para Comissão", async () => {
    render(React.createElement(SecretariaView));

    expect(screen.getByRole("tab", { name: "Aderidos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Aderido User")).toBeInTheDocument();
    expect(screen.queryByText("Admin User")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Comissão" }));

    expect(screen.getByRole("tab", { name: "Comissão" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.queryByText("Aderido User")).not.toBeInTheDocument();
  });

  it("Deve posicionar as abas abaixo dos cards de resumo", () => {
    render(React.createElement(SecretariaView));

    const resumoComissao = screen.getByRole("article", { name: "Resumo Comissão" });
    const tabAderidos = screen.getByRole("tab", { name: "Aderidos" });

    expect(
      resumoComissao.compareDocumentPosition(tabAderidos) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("Deve mostrar somente pesquisa como filtro visual", () => {
    render(React.createElement(SecretariaView));

    expect(screen.getByPlaceholderText(/Pesquisar por nome ou e-mail/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Filtrar por modalidade")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filtrar por status")).not.toBeInTheDocument();
  });

  it("Deve renderizar com notificacao fechada", () => {
    render(React.createElement(SecretariaView));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
