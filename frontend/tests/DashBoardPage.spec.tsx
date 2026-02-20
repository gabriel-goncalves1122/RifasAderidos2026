// ============================================================================
// ARQUIVO: DashBoardPage.spec.tsx (Testes de Componente do Frontend)
// ============================================================================

import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "../src/views/pages/DashboardPage";
import userEvent from "@testing-library/user-event"; // Adicione no topo do arquivo junto com os outros imports

// ----------------------------------------------------------------------------
// 1. ELEVAÇÃO E FALSIFICAÇÃO (HOISTING & MOCKING)
// ----------------------------------------------------------------------------
// O vi.hoisted cria as nossas funções ANTES de o React tentar rodar.
// Evita o "vazamento" onde o React tenta acessar o banco real por 1 milissegundo.
const mocks = vi.hoisted(() => ({
  buscarMinhasRifas: vi.fn().mockResolvedValue([
    { numero: "00001", status: "disponivel" },
    { numero: "00002", status: "pago" },
  ]),
}));

// Falsifica a conexão com o Firebase (Evita erro de rede e importação)
vi.mock("../src/config/firebase", () => ({
  auth: { currentUser: { uid: "123", email: "teste@teste.com" } },
  storage: {},
}));

// Falsifica o Hook que faria o "fetch" na nossa API do backend.
// Nós injetamos os bilhetinhos falsos que criamos ali em cima.
vi.mock("../src/services/useRifasController", () => ({
  useRifasController: () => ({
    loading: false,
    buscarMinhasRifas: mocks.buscarMinhasRifas,
  }),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpeza de cachê entre testes
  });

  // ========================================================================
  // TESTE 1: RENDERIZAÇÃO DA TELA (Com dados falsos)
  // ========================================================================
  it("deve renderizar o cabeçalho do painel do aderido e buscar as rifas", async () => {
    // A - ARRANGE & ACT (Renderizamos a tela dentro do roteador)
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    // A - ASSERT (Verificamos se o layout base carregou)
    // O findByText é assíncrono, útil para quando componentes demoram a piscar na tela
    const titulo = await screen.findByText(/Painel do Aderido/i);
    const mensagemBoasVindas = await screen.findByText(/Olá, Engenheiro!/i);

    expect(titulo).toBeInTheDocument();
    expect(mensagemBoasVindas).toBeInTheDocument();

    // Assert Crítico: Garante que a tela tentou buscar os bilhetes usando
    // a nossa função mockada (e não vazou tentando bater na API real)
    await waitFor(() => {
      expect(mocks.buscarMinhasRifas).toHaveBeenCalled();
    });
  });

  it("deve trocar para a aba de prêmios ao clicar", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    // A - ACT (Clica na aba de Prêmios)
    const abaPremios = await screen.findByRole("tab", {
      name: /Prêmios do Sorteio/i,
    });
    await user.click(abaPremios);

    // A - ASSERT (Verifica se o prêmio mockado apareceu na tela)
    const tituloPremio = await screen.findByText(/Pix de R\$ 5.000,00/i);
    expect(tituloPremio).toBeInTheDocument();
  });
});
