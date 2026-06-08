import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRifasSelection } from "@/features/aderidos/hooks/useRifasSelection";

describe("Hook: useRifasSelection", () => {
  it("Deve selecionar, remover e calcular valor apenas para rifas disponíveis", () => {
    const { result } = renderHook(() => useRifasSelection());

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
      result.current.alternarSelecaoRifa("002", "pago");
    });

    expect(result.current.selecionadas).toEqual(["001"]);
    expect(result.current.valorTotalSelecionado).toBe(10);
    expect(result.current.possuiSelecao).toBe(true);

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
    });

    expect(result.current.selecionadas).toEqual([]);
    expect(result.current.valorTotalSelecionado).toBe(0);
  });

  it("Deve limpar toda a seleção", () => {
    const { result } = renderHook(() => useRifasSelection());

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
      result.current.alternarSelecaoRifa("002", "disponivel");
      result.current.limparSelecao();
    });

    expect(result.current.selecionadas).toEqual([]);
  });
});
