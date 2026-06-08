import { useEffect, useMemo, useState } from "react";

import { AbaPix } from "../types/pixTabs";
import { usePixTransacoes } from "./usePixTransacoes";

interface UseTesourariaPixControllerParams {
  variante?: "desktop" | "mobile";
}

export function usePixController({
  variante = "desktop",
}: UseTesourariaPixControllerParams = {}) {
  const [abaAtual, setAbaAtual] = useState<AbaPix>("visao-geral");

  const {
    resumo,
    filtros,
    transacoes,
    transacoesFiltradas,
    carregando,
    sincronizando,
    validandoPixPorId,
    erroValidacaoPixPorId,
    setFiltros,
    sincronizarBanco,
    aceitarPixTransacao,
    negarPixTransacao,
  } = usePixTransacoes();

  useEffect(() => {
    if (variante === "mobile" && abaAtual === "conciliacao") {
      setAbaAtual("visao-geral");
    }
  }, [abaAtual, variante]);

  const abaVisivel =
    variante === "mobile" && abaAtual === "conciliacao"
      ? "visao-geral"
      : abaAtual;

  const pixProps = useMemo(
    () => ({
      resumo,
      filtros,
      transacoes: transacoesFiltradas,
      onChangeFiltros: setFiltros,
      validandoPixPorId,
      erroValidacaoPixPorId,
      onAceitarTransacao: aceitarPixTransacao,
      onNegarTransacao: negarPixTransacao,
    }),
    [
      aceitarPixTransacao,
      erroValidacaoPixPorId,
      filtros,
      negarPixTransacao,
      resumo,
      setFiltros,
      transacoesFiltradas,
      validandoPixPorId,
    ],
  );

  return {
    abaAtual,
    abaVisivel,
    resumo,
    filtros,
    transacoes,
    transacoesFiltradas,
    carregando,
    sincronizando,
    validandoPixPorId,
    erroValidacaoPixPorId,
    pixProps,
    setAbaAtual,
    setFiltros,
    sincronizarBanco,
    onSincronizar: sincronizarBanco,
    onAceitarTransacao: aceitarPixTransacao,
    onNegarTransacao: negarPixTransacao,
  };
}
