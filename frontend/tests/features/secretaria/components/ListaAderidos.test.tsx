// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/ListaAderidos.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { ListaAderidos } from "@/features/secretaria/components/ListaAderidos";

const aderidosMock = [
  {
    id: "ADERIDO_001",
    id_aderido: "ADERIDO_001",
    nome: "Gabriel Sampaio",
    email: "gabriel@email.com",
    telefone: "(35) 99999-8888",
    curso: "Engenharia de Computação",
    cargo: "aderido",
    modalidade_adesao: "completo",
    status_cadastro: "ativo",
    total_arrecadado: 150,
    rifas_vendidas: 15,
    meta_vendas: 150,
  },
  {
    id: "ADERIDO_002",
    id_aderido: "ADERIDO_002",
    nome: "Ana Beatriz",
    email: "ana@email.com",
    telefone: "(35) 98888-7777",
    curso: "Administração",
    cargo: "secretaria",
    modalidade_adesao: "meio",
    status_cadastro: "pendente",
    total_arrecadado: 50,
    rifas_vendidas: 5,
    meta_vendas: 75,
  },
];

function renderListaAderidos(overrides: Record<string, unknown> = {}) {
  const props = {
    aderidos: aderidosMock,
    lista: aderidosMock,
    carregando: false,
    onAbrirDetalhes: vi.fn(),
    onSelecionarAderido: vi.fn(),
    ...overrides,
  };

  render(createElement(ListaAderidos as any, props));

  return props;
}

describe("Componente: ListaAderidos", () => {
  it("Deve renderizar os aderidos recebidos", () => {
    renderListaAderidos();

    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("Ana Beatriz")).toBeInTheDocument();
  });

  it("Deve renderizar dados principais dos aderidos", () => {
    renderListaAderidos();

    expect(screen.getByText("gabriel@email.com")).toBeInTheDocument();
    expect(screen.getByText("ana@email.com")).toBeInTheDocument();
  });

  it("Deve manter a lista renderizada ao clicar no nome de um aderido", async () => {
    const user = userEvent.setup();

    renderListaAderidos();

    await user.click(screen.getByText("Gabriel Sampaio"));

    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("Ana Beatriz")).toBeInTheDocument();
  });

  it("Deve renderizar estado vazio quando não houver aderidos", () => {
    renderListaAderidos({
      aderidos: [],
      lista: [],
    });

    expect(
      screen.getByText(/nenhum|não encontrado|sem aderidos/i),
    ).toBeInTheDocument();
  });
});
