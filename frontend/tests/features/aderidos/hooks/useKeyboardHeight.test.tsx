import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useKeyboardHeight } from "@/shared/hooks/useKeyboardHeight";

describe("Hook: useKeyboardHeight", () => {
  const viewportOriginal = window.visualViewport;
  const innerHeightOriginal = window.innerHeight;

  afterEach(() => {
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: viewportOriginal,
    });

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: innerHeightOriginal,
    });
  });

  it("Deve retornar zero quando visualViewport não estiver disponível", () => {
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useKeyboardHeight());

    expect(result.current).toBe(0);
  });

  it("Deve calcular a altura do teclado pela diferença da viewport visual", () => {
    const viewport = new EventTarget() as VisualViewport;

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    Object.defineProperty(viewport, "height", {
      configurable: true,
      value: 520,
    });

    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: viewport,
    });

    const { result } = renderHook(() => useKeyboardHeight());

    expect(result.current).toBe(280);

    Object.defineProperty(viewport, "height", {
      configurable: true,
      value: 760,
    });

    act(() => {
      viewport.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(40);
  });

  it("Deve remover listeners ao desmontar", () => {
    const removeEventListener = vi.fn();
    const viewport = {
      height: 700,
      addEventListener: vi.fn(),
      removeEventListener,
    } as unknown as VisualViewport;

    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: viewport,
    });

    const { unmount } = renderHook(() => useKeyboardHeight());

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
