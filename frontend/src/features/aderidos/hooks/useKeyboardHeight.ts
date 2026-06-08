import { useEffect, useState } from "react";

function calcularAlturaTeclado() {
  const viewport = window.visualViewport;

  if (!viewport) return 0;

  return Math.max(0, Math.round(window.innerHeight - viewport.height));
}

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const atualizarAltura = () => {
      setKeyboardHeight(calcularAlturaTeclado());
    };

    atualizarAltura();

    window.addEventListener("resize", atualizarAltura);
    window.visualViewport?.addEventListener("resize", atualizarAltura);

    return () => {
      window.removeEventListener("resize", atualizarAltura);
      window.visualViewport?.removeEventListener("resize", atualizarAltura);
    };
  }, []);

  return keyboardHeight;
}
