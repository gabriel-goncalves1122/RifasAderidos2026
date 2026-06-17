import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useSecretariaKeyboard } from "@/features/secretaria/hooks/useSecretariaKeyboard";

describe("useSecretariaKeyboard", () => {
  it("Deve chamar onFocusSearch ao pressionar Ctrl+F", () => {
    const onFocusSearch = vi.fn();
    const onNewAderido = vi.fn();
    const onClosePanel = vi.fn();

    renderHook(() =>
      useSecretariaKeyboard({
        onFocusSearch,
        onNewAderido,
        onClosePanel,
        panelOpen: false,
        modalOpen: false,
      }),
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true }));

    expect(onFocusSearch).toHaveBeenCalledTimes(1);
    expect(onNewAderido).not.toHaveBeenCalled();
    expect(onClosePanel).not.toHaveBeenCalled();
  });

  it("Deve chamar onNewAderido ao pressionar N (sem input focado)", () => {
    const onFocusSearch = vi.fn();
    const onNewAderido = vi.fn();
    const onClosePanel = vi.fn();

    renderHook(() =>
      useSecretariaKeyboard({
        onFocusSearch,
        onNewAderido,
        onClosePanel,
        panelOpen: false,
        modalOpen: false,
      }),
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "n" }));

    expect(onNewAderido).toHaveBeenCalledTimes(1);
  });

  it("Deve chamar onClosePanel ao pressionar Escape com panel aberto", () => {
    const onFocusSearch = vi.fn();
    const onNewAderido = vi.fn();
    const onClosePanel = vi.fn();

    renderHook(() =>
      useSecretariaKeyboard({
        onFocusSearch,
        onNewAderido,
        onClosePanel,
        panelOpen: true,
        modalOpen: false,
      }),
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onClosePanel).toHaveBeenCalledTimes(1);
  });

  it("Nao deve chamar onNewAderido com Ctrl+N", () => {
    const onNewAderido = vi.fn();

    renderHook(() =>
      useSecretariaKeyboard({
        onFocusSearch: vi.fn(),
        onNewAderido,
        onClosePanel: vi.fn(),
        panelOpen: false,
        modalOpen: false,
      }),
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "n", ctrlKey: true }));
    expect(onNewAderido).not.toHaveBeenCalled();
  });
});
