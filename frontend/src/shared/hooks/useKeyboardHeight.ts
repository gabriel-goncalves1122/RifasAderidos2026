// ============================================================================
// HOOK COMPARTILHADO: useKeyboardHeight
//
// Detecta a altura do teclado virtual em dispositivos mobile
// usando window.visualViewport. Util para ajustar elementos
// fixos que precisam subir quando o teclado abre.
// ============================================================================
import { useEffect, useState } from "react";

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const atualizarAltura = () => {
      if (!window.visualViewport) return;

      const diferenca =
        window.innerHeight - window.visualViewport.height;

      setKeyboardHeight(Math.max(0, diferenca));
    };

    window.visualViewport?.addEventListener("resize", atualizarAltura);
    atualizarAltura();

    return () => {
      window.visualViewport?.removeEventListener("resize", atualizarAltura);
    };
  }, []);

  return keyboardHeight;
}
