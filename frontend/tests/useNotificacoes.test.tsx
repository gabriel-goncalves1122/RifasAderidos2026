import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNotificacoes } from "../src/controllers/useNotificacoes";
import { fetchAPI } from "../src/controllers/api";

vi.mock("../src/controllers/api", () => ({ fetchAPI: vi.fn() }));

describe("Hook: useNotificacoes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Deve buscar a lista de notificações do usuário", async () => {
    (fetchAPI as any).mockResolvedValueOnce({
      notificacoes: [{ id: "notif_1" }],
    });
    const { result } = renderHook(() => useNotificacoes());

    let lista;
    await act(async () => {
      lista = await result.current.buscarNotificacoes();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/notificacoes");
    expect(lista).toHaveLength(1);
  });

  it("Deve marcar as notificações como lidas usando PUT", async () => {
    const { result } = renderHook(() => useNotificacoes());

    await act(async () => {
      await result.current.marcarNotificacoesLidas(["notif_1", "notif_2"]);
    });

    expect(fetchAPI).toHaveBeenCalledWith("/notificacoes/ler", "PUT", {
      ids: ["notif_1", "notif_2"],
    });
  });
});
