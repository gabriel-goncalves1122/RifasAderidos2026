import { useEffect } from "react";

interface UseSecretariaKeyboardProps {
  onFocusSearch: () => void;
  onNewAderido: () => void;
  onClosePanel: () => void;
  panelOpen: boolean;
  modalOpen: boolean;
}

export function useSecretariaKeyboard({
  onFocusSearch,
  onNewAderido,
  onClosePanel,
  panelOpen,
  modalOpen,
}: UseSecretariaKeyboardProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const isInput =
        alvo.tagName === "INPUT" ||
        alvo.tagName === "TEXTAREA" ||
        alvo.isContentEditable;

      if (e.key === "Escape" && (panelOpen || modalOpen)) {
        e.preventDefault();
        onClosePanel();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      if (!isInput && e.key === "n" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onNewAderido();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onFocusSearch, onNewAderido, onClosePanel, panelOpen, modalOpen]);
}
