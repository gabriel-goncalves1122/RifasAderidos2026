import { useState, useCallback } from "react";
import type { TransacaoTesouraria } from "../types/auditoriaCompras";

export function useAuditoriaComprasModals() {
  const [compraSelecionada, setCompraSelecionada] = useState<TransacaoTesouraria | null>(null);
  const [compraEdicao, setCompraEdicao] = useState<TransacaoTesouraria | null>(null);
  const [compraNotificacao, setCompraNotificacao] = useState<TransacaoTesouraria | null>(null);

  const abrirDetalhes = useCallback((compra: TransacaoTesouraria) => {
    setCompraSelecionada(compra);
  }, []);

  const fecharDetalhes = useCallback(() => {
    setCompraSelecionada(null);
  }, []);

  const abrirEdicao = useCallback((compra: TransacaoTesouraria) => {
    setCompraEdicao(compra);
  }, []);

  const fecharEdicao = useCallback((bloqueado?: boolean) => {
    if (bloqueado) return;
    setCompraEdicao(null);
  }, []);

  const abrirNotificacao = useCallback((compra: TransacaoTesouraria) => {
    setCompraNotificacao(compra);
  }, []);

  const fecharNotificacao = useCallback((bloqueado?: boolean) => {
    if (bloqueado) return;
    setCompraNotificacao(null);
  }, []);

  return {
    compraSelecionada,
    compraEdicao,
    compraNotificacao,
    setCompraEdicao,
    setCompraNotificacao,
    abrirDetalhes,
    fecharDetalhes,
    abrirEdicao,
    fecharEdicao,
    abrirNotificacao,
    fecharNotificacao,
  };
}
