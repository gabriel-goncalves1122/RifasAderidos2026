import { useCallback, useState } from "react";

import { GrupoRifasRecusadas, RifaAderido } from "../types/painelAderido";

export type ModalPainelAderido =
  | "checkout"
  | "correction"
  | "details"
  | "notifications";

export function useModalStack() {
  const [current, setCurrent] = useState<ModalPainelAderido | null>(null);
  const [grupoParaCorrigir, setGrupoParaCorrigir] =
    useState<GrupoRifasRecusadas | null>(null);
  const [rifaParaDetalhes, setRifaParaDetalhesState] =
    useState<RifaAderido | null>(null);

  const push = useCallback((modal: ModalPainelAderido) => {
    setCurrent(modal);
  }, []);

  const pop = useCallback(() => {
    setCurrent(null);
  }, []);

  const reset = useCallback(() => {
    setCurrent(null);
    setGrupoParaCorrigir(null);
    setRifaParaDetalhesState(null);
  }, []);

  const setModalCheckoutAberto = useCallback(
    (aberto: boolean) => {
      if (aberto) {
        push("checkout");
        return;
      }

      setCurrent((modalAtual) => (modalAtual === "checkout" ? null : modalAtual));
    },
    [push],
  );

  const setDrawerNotificacoesAberto = useCallback(
    (aberto: boolean) => {
      if (aberto) {
        push("notifications");
        return;
      }

      setCurrent((modalAtual) =>
        modalAtual === "notifications" ? null : modalAtual,
      );
    },
    [push],
  );

  const setModalCorrecaoAberto = useCallback(
    (aberto: boolean) => {
      if (aberto) {
        push("correction");
        return;
      }

      setCurrent((modalAtual) =>
        modalAtual === "correction" ? null : modalAtual,
      );
    },
    [push],
  );

  const setRifaParaDetalhes = useCallback(
    (rifa: RifaAderido | null) => {
      setRifaParaDetalhesState(rifa);

      if (rifa) {
        push("details");
        return;
      }

      setCurrent((modalAtual) => (modalAtual === "details" ? null : modalAtual));
    },
    [push],
  );

  return {
    current,
    grupoParaCorrigir,
    rifaParaDetalhes,
    modalCheckoutAberto: current === "checkout",
    drawerNotificacoesAberto: current === "notifications",
    modalCorrecaoAberto: current === "correction",
    push,
    pop,
    reset,
    setModalCheckoutAberto,
    setDrawerNotificacoesAberto,
    setModalCorrecaoAberto,
    setGrupoParaCorrigir,
    setRifaParaDetalhes,
  };
}
