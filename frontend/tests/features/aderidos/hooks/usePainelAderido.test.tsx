// ============================================================================
// ARQUIVO: frontend/tests/features/aderidos/hooks/usePainelAderido.test.tsx
// ============================================================================
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  buscarMinhasRifas: vi.fn(),
  corrigirRifasRecusadas: vi.fn(),

  buscarNotificacoes: vi.fn(),
  marcarNotificacoesLidas: vi.fn(),

  usuarioAtual: {
    uid: "USER_001",
    nome: "Gabriel Sampaio",
    displayName: "Gabriel Sampaio",
    email: "gabriel@email.com",
  },
}));

vi.mock("@/features/rifas/hooks/useRifas", () => ({
  useRifas: () => ({
    buscarMinhasRifas: mocks.buscarMinhasRifas,
    corrigirRifasRecusadas: mocks.corrigirRifasRecusadas,
  }),
}));

vi.mock("@/shared/hooks/useNotificacoes", () => ({
  useNotificacoes: () => ({
    buscarNotificacoes: mocks.buscarNotificacoes,
    marcarNotificacoesLidas: mocks.marcarNotificacoesLidas,
  }),
}));

vi.mock("@/features/auth/hooks/useAuthController", () => ({
  useAuthController: () => ({
    usuarioAtual: mocks.usuarioAtual,
    loading: false,
  }),
}));

import { usePainelAderido } from "@/features/aderidos/hooks/usePainelAderido";

const rifasMock = [
  {
    numero: "001",
    status: "disponivel",
    vendedor_nome: "Gabriel Sampaio",
  },
  {
    numero: "002",
    status: "pago",
    vendedor_nome: "Gabriel Sampaio",
  },
  {
    numero: "003",
    status: "recusado",
    vendedor_nome: "Gabriel Sampaio",
    comprador_nome: "Ana",
    comprador_email: "ana@email.com",
    comprador_telefone: "(35) 99999-9999",
    data_pagamento: "2026-05-01",
    motivo_recusa: "Comprovante ilegível",
  },
];

const notificacoesMock = [
  {
    id: "NOT_001",
    titulo: "Aviso",
    mensagem: "Mensagem de teste",
    lida: false,
  },
];

describe("Hook: usePainelAderido", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.buscarMinhasRifas.mockResolvedValue(rifasMock);
    mocks.buscarNotificacoes.mockResolvedValue(notificacoesMock);
    mocks.marcarNotificacoesLidas.mockResolvedValue(undefined);
    mocks.corrigirRifasRecusadas.mockResolvedValue(true);
  });

  it("Deve buscar rifas e notificações ao inicializar o painel", async () => {
    renderHook(() => usePainelAderido());

    await waitFor(() => {
      expect(mocks.buscarMinhasRifas).toHaveBeenCalledTimes(1);
      expect(mocks.buscarNotificacoes).toHaveBeenCalledTimes(1);
    });
  });

  it("Deve montar o primeiro nome do usuário logado", async () => {
    const { result } = renderHook(() => usePainelAderido());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.primeiroNome).toBe("Gabriel");
  });

  it("Deve armazenar as rifas retornadas pelo hook de rifas", async () => {
    const { result } = renderHook(() => usePainelAderido());

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(3);
    });

    expect(result.current.minhasRifas[0].numero).toBe("001");
    expect(result.current.notificacoes).toHaveLength(1);
  });

  it("Deve selecionar e remover uma rifa disponível da seleção", async () => {
    const { result } = renderHook(() => usePainelAderido());

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(3);
    });

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
    });

    expect(result.current.selecionadas).toEqual(["001"]);

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
    });

    expect(result.current.selecionadas).toEqual([]);
  });

  it("Não deve selecionar rifas que não estejam disponíveis", async () => {
    const { result } = renderHook(() => usePainelAderido());

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(3);
    });

    act(() => {
      result.current.alternarSelecaoRifa("002", "pago");
    });

    act(() => {
      result.current.alternarSelecaoRifa("003", "recusado");
    });

    expect(result.current.selecionadas).toEqual([]);
  });
});
